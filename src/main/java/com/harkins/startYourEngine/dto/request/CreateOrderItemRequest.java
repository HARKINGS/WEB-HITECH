package com.harkins.startYourEngine.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateOrderItemRequest {
    @NotBlank(message = "NOT_EMPTY")
    String goodsId;
    @NotBlank(message = "NOT_EMPTY")
    Integer quantity;
}
