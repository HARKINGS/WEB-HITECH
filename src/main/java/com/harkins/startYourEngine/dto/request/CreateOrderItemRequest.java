package com.harkins.startYourEngine.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderItemRequest {
    private Long goodsId;
    private Integer quantity;
}
