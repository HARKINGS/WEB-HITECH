package com.harkins.startYourEngine.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.harkins.startYourEngine.dto.request.CreateOrderItemRequest;
import com.harkins.startYourEngine.dto.request.CreateOrderRequest;
import com.harkins.startYourEngine.dto.response.OrderResponse;
import com.harkins.startYourEngine.entity.*;
import com.harkins.startYourEngine.enums.OrderItemStatus;
import com.harkins.startYourEngine.enums.OrderStatus;
import com.harkins.startYourEngine.enums.PaymentStatus;
import com.harkins.startYourEngine.mapper.OrderMapper;
import com.harkins.startYourEngine.repository.*;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderService {

    OrderRepository orderRepo;
    OrderItemRepository orderItemRepo;
    GoodsRepository goodsRepo;
    OrderMapper orderMapper;
    VoucherRepository voucherRepo;

    @PreAuthorize("hasAuthority('PLACE_ORDER')")
    @Transactional(rollbackFor = Exception.class)
    public OrderResponse placeOrder(CreateOrderRequest request) throws NotFoundException {
        // Lấy voucher (nếu có)
        Voucher voucher = null;
        if (request.getVoucherId() != null) {
            voucher = voucherRepo.findById(request.getVoucherId()).orElse(null);
        }

        // Tạo đơn hàng mới
        Order order = new Order();
        order.setShippingAddress(request.getShippingAddress());
        order.setVoucher(voucher);
        order.setTotalPrice(request.getTotalPrice());
        order.setTotalDiscount(request.getTotalDiscount());
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
            item.setOrder(order);
            item.setStatus(OrderItemStatus.PENDING);

            orderItems.add(item);
        }

        order.setOrderItems(orderItems);

        // Lưu đơn hàng
        Order savedOrder = orderRepo.save(order);

        // Chuyển sang DTO và trả về
        return orderMapper.toOrderResponse(savedOrder);
    }

    @PreAuthorize("hasAuthority('UPDATE_ORDERITEM')")
    public OrderResponse updateOrderItemStatus(String orderItemId, String status) {
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

    @PreAuthorize("hasAuthority('GET_ORDER_BY_ID')")
    public OrderResponse getOrderById(String orderId) throws NotFoundException {
        log.info("Getting order by ID: {}", orderId);

        Order order = orderRepo.findById(orderId).orElseThrow(() -> {
            log.error("Order not found with ID: {}", orderId);
            return new NotFoundException();
        });

        return orderMapper.toOrderResponse(order);
    }

    // @PreAuthorize("hasAuthority('GET_CURRENT_USERORDERS')")
    // public List<OrderResponse> getCurrentUserOrders() {
    //     UserResponse user = userService.getMyInfo();
    //     List<Order> orders = orderRepo.findByUser_UserId(user.getUserId());
    //     return orders.stream().map(orderMapper::toOrderResponse).collect(Collectors.toList());
    // }

    @PreAuthorize("hasAuthority('UPDATE_ORDER_STATUS')")
    @Transactional
    public OrderResponse updateOrderStatus(String orderId, String status) throws NotFoundException {
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

    @PreAuthorize("hasAuthority('UPDATE_PAYMENT_STATUS')")
    @Transactional
    public OrderResponse updatePaymentStatus(String orderId, String status) throws Exception {
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

    @PreAuthorize("hasAuthority('GET_ALL_ORDERS')")
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepo.findAll();
        return orders.stream().map(orderMapper::toOrderResponse).collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('GET_ORDERS_BY_STATUS')")
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

    // @PreAuthorize("hasAuthority('GET_ORDERS_BY_USERID')")
    // public List<OrderResponse> getOrdersByUserId(String userId) {
    //     List<Order> orders = orderRepo.findByUser_UserId(userId);
    //     return orders.stream().map(orderMapper::toOrderResponse).collect(Collectors.toList());
    // }

    @PreAuthorize("hasAuthority('DELETE_ORDER')")
    public void deleteOrder(String orderId) {
        orderRepo.deleteById(orderId);
    }
}
