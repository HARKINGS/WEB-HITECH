package com.harkins.startYourEngine.dto.response;

import com.harkins.startYourEngine.enums.OrderStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemResponse {
    private String id;
    private String orderId;
    private OrderStatus status;
    private String goodsId;
    private String goodsName;
    private Integer quantity;
    private String userId;
    private String username;
}
