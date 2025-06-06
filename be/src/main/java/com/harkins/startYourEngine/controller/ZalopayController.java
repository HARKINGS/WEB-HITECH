package com.harkins.startYourEngine.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.harkins.startYourEngine.entity.Order;
import com.harkins.startYourEngine.enums.PaymentStatus;
import com.harkins.startYourEngine.repository.OrderRepository;
import com.harkins.startYourEngine.service.OrderService;
import com.harkins.startYourEngine.service.ZalopayService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("zalopay")
@RequiredArgsConstructor
public class ZalopayController {

    private final ZalopayService zalopayService;
    private final OrderRepository orderRepo;
    private final OrderService orderService;
    private static final Logger log = LoggerFactory.getLogger(ZalopayController.class);

    @PostMapping("/create-order")
    public ResponseEntity<Object> createOrder(@RequestBody Map<String, Object> orderRequest) {
        try {
            // Kiểm tra tham số bắt buộc
            if (!orderRequest.containsKey("amount")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required parameter: amount"));
            }

            // Chuyển orderID thành orderId nếu cần (để tương thích với service)
            if (orderRequest.containsKey("orderID") && !orderRequest.containsKey("orderId")) {
                orderRequest.put("orderId", orderRequest.get("orderID"));
            }

            // Đảm bảo amount là số
            if (orderRequest.containsKey("amount")) {
                try {
                    // Nếu là Double, chuyển thành Long
                    if (orderRequest.get("amount") instanceof Double) {
                        double amountValue = (Double) orderRequest.get("amount");
                        orderRequest.put("amount", (long) amountValue);
                    }
                    // Nếu là String, parse thành Long
                    else if (orderRequest.get("amount") instanceof String) {
                        double amountValue = Double.parseDouble((String) orderRequest.get("amount"));
                        orderRequest.put("amount", (long) amountValue);
                    }
                } catch (NumberFormatException e) {
                }
            }

            // Gọi service để tạo đơn hàng ZaloPay
            String result = zalopayService.createOrder(orderRequest);

            // Kiểm tra xem response có lỗi JSON không
            if (result.startsWith("{\"error\":")) {
                return ResponseEntity.status(500).body(result);
            }

            // Parse và trả về response
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> response = mapper.readValue(result, Map.class);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/order-status/{appTransId}")
    public ResponseEntity<Object> getOrderStatus(@PathVariable String appTransId) {
        try {
            String result = zalopayService.getOrderStatus(appTransId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/callback")
    public ResponseEntity<?> handleZaloPayCallback(@RequestBody Map<String, Object> request) {
        log.info("Received ZaloPay callback: {}", request);

        try {
            // ZaloPay gửi appTransId trong phần 'data' dưới dạng json string
            Map<String, Object> data;
            if (request.containsKey("data") && request.get("data") instanceof String) {
                // Nếu data là String, parse nó thành Map
                ObjectMapper objectMapper = new ObjectMapper();
                data = objectMapper.readValue((String) request.get("data"), Map.class);
            } else if (request.containsKey("data") && request.get("data") instanceof Map) {
                // Nếu data đã là Map
                data = (Map<String, Object>) request.get("data");
            } else {
                // Nếu không có data, sử dụng request hiện tại (dự phòng)
                data = request;
            }

            // Lấy app_trans_id từ data
            String appTransId = (String) data.get("app_trans_id");
            if (appTransId == null) {
                return ResponseEntity.badRequest().body("No app_trans_id found");
            }

            // Lấy status từ ZaloPay
            String statusValue = "1"; // Default là "1" = thành công
            if (data.containsKey("status")) {
                statusValue = data.get("status").toString();
            }

            // Tìm đơn hàng trong DB dựa vào app_trans_id
            Optional<Order> orderOpt = orderRepo.findByTransactionId(appTransId);
            if (!orderOpt.isPresent()) {
                return ResponseEntity.status(404).body("Order not found");
            }

            Order order = orderOpt.get();

            // Cập nhật trạng thái đơn hàng dựa vào status từ ZaloPay
            // ZaloPay trả về "1" cho thành công, khác "1" là thất bại
            try {
                // Chuyển đổi từ mã ZaloPay sang enum của chúng ta
                String paymentStatus = "1".equals(statusValue) ? "PAID" : "FAILED";

                orderService.updatePaymentStatus(order.getId(), PaymentStatus.valueOf(paymentStatus));
            } catch (Exception e) {
                // Không return ở đây để vẫn trả về thành công cho ZaloPay
            }

            // Trả về kết quả cho ZaloPay
            Map<String, Object> response = new HashMap<>();
            response.put("return_code", 1); // Luôn trả về 1 để ZaloPay không gửi lại callback
            response.put("return_message", "success");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Ngay cả khi có lỗi, vẫn trả về success để ZaloPay không gửi lại callback
            Map<String, Object> response = new HashMap<>();
            response.put("return_code", 1);
            response.put("return_message", "success");
            return ResponseEntity.ok(response);
        }
    }
}
