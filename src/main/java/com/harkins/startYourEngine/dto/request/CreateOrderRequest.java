package com.harkins.startYourEngine.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;

import com.harkins.startYourEngine.enums.PaymentMethod;

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
    String shippingAddress;

    String voucherId;

    @NotBlank(message = "NOT_EMPTY")
    PaymentMethod paymentMethod;

    @NonNull
    Long totalPrice;

    @NonNull
    Long totalDiscount;
}
