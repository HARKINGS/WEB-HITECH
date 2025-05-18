package com.harkins.startYourEngine.dto.response;

import java.util.List;

import com.harkins.startYourEngine.entity.Voucher;
import com.harkins.startYourEngine.enums.OrderStatus;
import com.harkins.startYourEngine.enums.PaymentStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderResponse {
    private String id;
    private List<OrderItemResponse> orderItems;
    private Voucher voucher;
    private String username;
    private String shippingAddress;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private String paymentMethod;
    private Long totalPrice;
    private Double finalPrice;
    private String transactionId;
}
