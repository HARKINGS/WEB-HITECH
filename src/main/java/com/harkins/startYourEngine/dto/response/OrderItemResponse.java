package com.harkins.startYourEngine.dto.response;

import com.harkins.startYourEngine.enums.OrderItemStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemResponse {
    private String id;
    private String orderId;
    private OrderItemStatus status;
    private GoodsResponse goods;
    private Integer quantity;
    private String username;
}
