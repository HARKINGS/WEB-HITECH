package com.harkins.startYourEngine.service;

import java.time.LocalDate;
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
import com.harkins.startYourEngine.enums.PaymentMethod;
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
        // Validate request
        if (request.getOrderItems() == null || request.getOrderItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        // Lấy và validate voucher (nếu có)
        Voucher voucher = null;
        if (request.getVoucher() != null) {
            voucher = voucherRepo
                    .findById(request.getVoucher().getVoucherId())
                    .orElseThrow(() -> new IllegalArgumentException("Voucher not found"));

            // Kiểm tra voucher còn hiệu lực không
            if (voucher.getExpiryDate().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Voucher has expired");
            }

            // Kiểm tra voucher đã được sử dụng chưa
            if (voucher.isValidated()) {
                throw new IllegalArgumentException("Voucher has already been used");
            }
        }

        // Tạo đơn hàng mới
        Order order = new Order();

        // Tính toán giá cuối cùng
        if (voucher != null) {
            double discountAmount = voucher.getDiscountAmount() / 100.0;
            double discountedPrice = request.getTotalPrice() * (1 - discountAmount);
            order.setFinalPrice(discountedPrice);
            order.setVoucher(voucher);
            // Đánh dấu voucher đã sử dụng
            voucher.setValidated(true);
            voucherRepo.save(voucher);
        } else {
            // Nếu không có voucher, finalPrice = totalPrice
            order.setFinalPrice(request.getTotalPrice().doubleValue());
        }

        order.setShippingAddress(request.getShippingAddress());
        order.setTotalPrice(request.getTotalPrice());

        // Xử lý các item và kiểm tra tồn kho
        List<OrderItem> orderItems = new ArrayList<>();
        for (CreateOrderItemRequest itemReq : request.getOrderItems()) {
            Goods goods = goodsRepo
                    .findById(itemReq.getGoodsId())
                    .orElseThrow(
                            () -> new IllegalArgumentException("Goods not found with id: " + itemReq.getGoodsId()));
            // Kiểm tra số lượng tồn kho
            if (goods.getQuantity() < itemReq.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for goods: " + goods.getGoodsName());
            }

            // Cập nhật số lượng tồn kho
            goods.setQuantity(goods.getQuantity() - itemReq.getQuantity());
            goodsRepo.save(goods);

            OrderItem item = new OrderItem();
            item.setGoods(goods);
            item.setQuantity(itemReq.getQuantity());
            item.setOrder(order);
            item.setStatus(OrderItemStatus.PENDING);

            orderItems.add(item);
        }

        order.setOrderItems(orderItems);

        // Set trạng thái đơn hàng và thanh toán
        if (request.getPaymentMethod() == PaymentMethod.ZALOPAY || request.getPaymentMethod() == PaymentMethod.VNPAY) {
            order.setStatus(OrderStatus.PROCESSING);
            order.setPaymentStatus(PaymentStatus.PROCESSING);
        } else {
            order.setStatus(OrderStatus.PENDING);
            order.setPaymentStatus(PaymentStatus.PENDING);
        }
        order.setPaymentMethod(request.getPaymentMethod().toString());

        // Lưu đơn hàng
        Order savedOrder = orderRepo.save(order);

        // Chuyển sang DTO và trả về
        return orderMapper.toOrderResponse(savedOrder);
    }

    @PreAuthorize("hasAuthority('UPDATE_ORDERITEM')")
    public OrderResponse updateOrderItemStatus(String orderItemId, OrderItemStatus status) {
        OrderItem orderItem = orderItemRepo.findById(orderItemId).orElseThrow(() -> new RuntimeException());
        try {
            orderItem.setStatus(status);
            orderItemRepo.save(orderItem);
            // Trả về OrderResponse của đơn hàng chứa item này
            return orderMapper.toOrderResponse(orderItem.getOrder());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order item status: " + status);
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
    public OrderResponse updateOrderStatus(String orderId, OrderStatus status) throws NotFoundException {
        Order order = orderRepo.findById(orderId).orElseThrow(() -> new NotFoundException());

        try {
            order.setStatus(status);
            Order updatedOrder = orderRepo.save(order);
            return orderMapper.toOrderResponse(updatedOrder);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + status);
        }
    }

    @PreAuthorize("hasAuthority('UPDATE_PAYMENT_STATUS')")
    @Transactional
    public OrderResponse updatePaymentStatus(String orderId, PaymentStatus status) throws Exception {
        try {
            Order order = orderRepo.findById(orderId).orElseThrow(() -> {
                log.error("Order not found for payment update: {}", orderId);
                return new NotFoundException();
            });

            order.setPaymentStatus(status);

            // Nếu thanh toán thành công, cập nhật trạng thái đơn hàng
            if (status == PaymentStatus.PAID) {
                log.info("Payment PAID, updating order status to CONFIRMED");
                order.setStatus(OrderStatus.CONFIRMED);
            }
            // Nếu thanh toán thất bại, cập nhật trạng thái đơn hàng
            else if (status == PaymentStatus.FAILED) {
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
    public List<OrderResponse> getOrdersByStatus(OrderStatus status) {
        try {
            log.info("Finding orders with status: {}", status);

            List<Order> orders = orderRepo.findByStatus(status);

            return orders.stream().map(orderMapper::toOrderResponse).collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            log.error("Invalid order status: {}. Error: {}", status, e.getMessage());
            return new ArrayList<>(); // Trả về danh sách rỗng nếu status không hợp lệ
        }
    }

    @PreAuthorize("hasAuthority('DELETE_ORDER')")
    public void deleteOrder(String orderId) {
        orderRepo.deleteById(orderId);
    }
}
