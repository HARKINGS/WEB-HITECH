package com.harkins.startYourEngine.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.harkins.startYourEngine.dto.request.CreateOrderRequest;
import com.harkins.startYourEngine.dto.response.OrderResponse;
import com.harkins.startYourEngine.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // 1. Đặt hàng mới
    @PostMapping("/create")
    public ResponseEntity<?> placeOrder(@RequestBody CreateOrderRequest request) {
        try {
            OrderResponse createdOrder = orderService.placeOrder(request);
            return ResponseEntity.ok(createdOrder);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error processing order: " + e.getMessage());
        }
    }

    // 2. Cập nhật trạng thái 1 item trong đơn hàng
    @PutMapping("/update-item-status/{orderItemId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateOrderItemStatus(@PathVariable String orderItemId, @RequestParam String status) {
        try {
            OrderResponse updatedOrder = orderService.updateOrderItemStatus(orderItemId, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating order item status: " + e.getMessage());
        }
    }

    // 3. Lấy trạng thái đơn hàng
    @GetMapping("/order-status/{orderId}")
    public ResponseEntity<?> getOrderStatus(@PathVariable String orderId) {
        try {
            OrderResponse order = orderService.getOrderById(orderId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("status", order.getStatus());
            response.put("paymentStatus", order.getPaymentStatus());
            response.put("orderId", order.getId());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    // 4. Lấy đơn hàng của user hiện tại
    @GetMapping("/user")
    public ResponseEntity<?> getUserOrders() {
        try {
            List<OrderResponse> orders = orderService.getCurrentUserOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error getting user orders: " + e.getMessage());
        }
    }

    // 5. Cập nhật trạng thái đơn hàng
    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String orderId, @RequestParam String status) {
        try {
            OrderResponse updatedOrder = orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating order status: " + e.getMessage());
        }
    }

    // 6. Cập nhật trạng thái thanh toán
    @PutMapping("/{orderId}/payment-status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable String orderId, @RequestParam String status) {
        try {
            OrderResponse updatedOrder = orderService.updatePaymentStatus(orderId, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating payment status: " + e.getMessage());
        }
    }

    // 7. Lấy tất cả đơn hàng
    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // 8. Lấy đơn hàng theo trạng thái
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getOrdersByStatus(@PathVariable String status) {
        try {
            List<OrderResponse> orders = orderService.getOrdersByStatus(status);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    // 9. Lấy đơn hàng theo userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrdersByUserId(@PathVariable String userId) {
        List<OrderResponse> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    // 10. Xóa đơn hàng
    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable String orderId) {
        List<OrderResponse> deleted = orderService.deleteOrder(orderId);
        return ResponseEntity.ok(Map.of("deleted", deleted));
    }
}
