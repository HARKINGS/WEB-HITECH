package com.harkins.startYourEngine.dto.response;

import com.harkins.startYourEngine.enums.OrderStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemResponse {
    private Long id;
    private Long orderId;
    private OrderStatus status;
    private Long goodsId;
    private String goodsName;
    private Integer quantity;
    private Long userId;
    private String username;
}
