package com.harkins.startYourEngine.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateOrderRequest {
    @NotBlank(message = "NOT_EMPTY")
    List<CreateOrderItemRequest> orderItems;
    @NotBlank(message = "NOT_EMPTY")
    String addressId;
    @NotBlank(message = "NOT_EMPTY")
    String voucherId;
    @NotBlank(message = "NOT_EMPTY")
    String paymentMethod;
    @NotBlank(message = "NOT_EMPTY")
    Double totalPrice;
    @NotBlank(message = "NOT_EMPTY")
    Double totalDiscount;
}
