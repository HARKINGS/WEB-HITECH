package com.harkins.startYourEngine.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateOrderItemRequest {

    String goodsId;

    Integer quantity;
}
