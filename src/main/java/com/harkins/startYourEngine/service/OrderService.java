package com.harkins.startYourEngine.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.harkins.startYourEngine.dto.request.CreateOrderItemRequest;
import com.harkins.startYourEngine.dto.request.CreateOrderRequest;
import com.harkins.startYourEngine.dto.response.OrderResponse;
import com.harkins.startYourEngine.dto.response.UserResponse;
import com.harkins.startYourEngine.entity.Address;
import com.harkins.startYourEngine.entity.Goods;
import com.harkins.startYourEngine.entity.Order;
import com.harkins.startYourEngine.entity.OrderItem;
import com.harkins.startYourEngine.entity.User;
import com.harkins.startYourEngine.entity.Voucher;
import com.harkins.startYourEngine.enums.OrderStatus;
import com.harkins.startYourEngine.enums.PaymentStatus;
import com.harkins.startYourEngine.mapper.OrderMapper;
import com.harkins.startYourEngine.repository.AddressRepository;
import com.harkins.startYourEngine.repository.GoodsRepository;
import com.harkins.startYourEngine.repository.OrderItemRepository;
import com.harkins.startYourEngine.repository.OrderRepository;
import com.harkins.startYourEngine.repository.UserRepository;
import com.harkins.startYourEngine.repository.VoucherRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepo;
    private final OrderItemRepository orderItemRepo;
    private final GoodsRepository goodsRepo;
    private final UserService userService;
    private final OrderMapper orderMapper;
    private final AddressRepository addressRepo;
    private final VoucherRepository voucherRepo;
    private final UserRepository userRepository;

    @Transactional(rollbackFor = Exception.class)
    public OrderResponse placeOrder(CreateOrderRequest request) throws NotFoundException {
        // Lấy user đang đăng nhập (DTO)
        UserResponse userResponse = userService.getMyInfo();
        // Lấy entity User từ userId
        User user = userRepository
                .findById(userResponse.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userResponse.getUserId()));

        // Lấy địa chỉ giao hàng (nếu có)
        Address address = null;
        if (request.getAddressId() != null) {
            address = addressRepo.findById(request.getAddressId()).orElseThrow(() -> new NotFoundException());
        }

        // Lấy voucher (nếu có)
        Voucher voucher = null;
        if (request.getVoucherId() != null) {
            voucher = voucherRepo.findById(request.getVoucherId()).orElse(null);
        }

        // Tạo đơn hàng mới
        Order order = new Order();
        order.setUser(user);
        order.setAddress(address);
        order.setVoucher(voucher);
        order.setTotalPrice(request.getTotalPrice());
        order.setTotalDiscount(request.getTotalDiscount());
        order.setPaymentMethod(request.getPaymentMethod());

        // Đảm bảo có status cho Order
        if ("ZALOPAY".equalsIgnoreCase(request.getPaymentMethod())
                || "VNPAY".equalsIgnoreCase(request.getPaymentMethod())) {
            order.setStatus(OrderStatus.PROCESSING);
            order.setPaymentStatus(PaymentStatus.PROCESSING);
        } else {
            order.setStatus(OrderStatus.PENDING);
            order.setPaymentStatus(PaymentStatus.PENDING);
        }

        // Xử lý các item
        List<OrderItem> orderItems = new ArrayList<>();
        for (CreateOrderItemRequest itemReq : request.getOrderItems()) {
            Goods goods = goodsRepo
                    .findById(itemReq.getGoodsId())
                    .orElseThrow(() -> new RuntimeException("Goods not found with id: " + itemReq.getGoodsId()));

            OrderItem item = new OrderItem();
            item.setGoods(goods);
            item.setQuantity(itemReq.getQuantity());
            item.setUser(user);
            item.setOrder(order);
            item.setStatus(order.getStatus()); // Lấy status từ Order

            orderItems.add(item);
        }

        order.setOrderItems(orderItems);

        // Lưu đơn hàng
        Order savedOrder = orderRepo.save(order);

        // Chuyển sang DTO và trả về
        return orderMapper.toOrderResponse(savedOrder);
    }

    public OrderResponse updateOrderItemStatus(Long orderItemId, String status) {
        // Vì OrderItem không có trường status, chúng ta sẽ cập nhật trạng thái của đơn hàng chứa item này
        OrderItem orderItem = orderItemRepo.findById(orderItemId).orElseThrow(() -> new RuntimeException());

        Order order = orderItem.getOrder();
        try {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            order.setStatus(orderStatus);
            orderRepo.save(order);

            // Trả về OrderItemDTO đã cập nhật
            return orderMapper.toOrderResponse(order);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + status);
        }
    }

    public OrderResponse getOrderById(Long orderId) throws NotFoundException {
        log.info("Getting order by ID: {}", orderId);

        Order order = orderRepo.findById(orderId).orElseThrow(() -> {
            log.error("Order not found with ID: {}", orderId);
            return new NotFoundException();
        });

        return orderMapper.toOrderResponse(order);
    }

    public List<OrderResponse> getCurrentUserOrders() {
        UserResponse user = userService.getMyInfo();
        List<Order> orders = orderRepo.findByUser_UserId(user.getUserId());
        return orders.stream().map(orderMapper::toOrderResponse).collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String status) throws NotFoundException {
        Order order = orderRepo.findById(orderId).orElseThrow(() -> new NotFoundException());

        try {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            order.setStatus(orderStatus);
            Order updatedOrder = orderRepo.save(order);
            return orderMapper.toOrderResponse(updatedOrder);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + status);
        }
    }

    @Transactional
    public OrderResponse updatePaymentStatus(Long orderId, String status) throws Exception {
        try {
            Order order = orderRepo.findById(orderId).orElseThrow(() -> {
                log.error("Order not found for payment update: {}", orderId);
                return new NotFoundException();
            });

            // Xử lý trường hợp status không hợp lệ
            PaymentStatus paymentStatus;
            try {
                paymentStatus = PaymentStatus.valueOf(status.toUpperCase());
                log.info("Converted status string '{}' to enum: {}", status, paymentStatus);
            } catch (IllegalArgumentException e) {
                log.error("Invalid payment status: {}, falling back to FAILED", status);
                paymentStatus = PaymentStatus.FAILED;
            }

            order.setPaymentStatus(paymentStatus);

            // Nếu thanh toán thành công, cập nhật trạng thái đơn hàng
            if (paymentStatus == PaymentStatus.PAID) {
                log.info("Payment PAID, updating order status to CONFIRMED");
                order.setStatus(OrderStatus.CONFIRMED);
            }
            // Nếu thanh toán thất bại, cập nhật trạng thái đơn hàng
            else if (paymentStatus == PaymentStatus.FAILED) {
                log.info("Payment FAILED, updating order status to CANCELLED");
                order.setStatus(OrderStatus.CANCELLED);
            }

            Order updatedOrder = orderRepo.save(order);

            return orderMapper.toOrderResponse(updatedOrder);
        } catch (Exception e) {
            log.error("Error updating payment status: ", e);
            throw e;
        }
    }

    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepo.findAll();
        return orders.stream().map(orderMapper::toOrderResponse).collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByStatus(String status) {
        try {
            log.info("Finding orders with status: {}", status);

            // Chuyển đổi String thành enum OrderStatus
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            List<Order> orders = orderRepo.findByStatus(orderStatus);

            log.info("Found {} orders with status {}", orders.size(), orderStatus);
            return orders.stream().map(orderMapper::toOrderResponse).collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            log.error("Invalid order status: {}. Error: {}", status, e.getMessage());
            return new ArrayList<>(); // Trả về danh sách rỗng nếu status không hợp lệ
        }
    }

    public List<OrderResponse> getOrdersByUserId(String userId) {
        List<Order> orders = orderRepo.findByUser_UserId(userId);
        return orders.stream().map(orderMapper::toOrderResponse).collect(Collectors.toList());
    }

    public List<OrderResponse> deleteOrder(Long orderId) {
        orderRepo.deleteById(orderId);
        return getCurrentUserOrders();
    }
}
