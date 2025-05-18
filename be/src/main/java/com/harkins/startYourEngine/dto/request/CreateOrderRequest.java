package com.harkins.startYourEngine.dto.request;

import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import com.harkins.startYourEngine.entity.Voucher;
import com.harkins.startYourEngine.enums.PaymentMethod;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateOrderRequest {
    @NotNull(message = "NOT_EMPTY")
    List<CreateOrderItemRequest> orderItems;

    @NotBlank(message = "NOT_EMPTY")
    String shippingAddress;

    Voucher voucher;

    @NotNull(message = "NOT_EMPTY")
    PaymentMethod paymentMethod;

    @NotNull(message = "NOT_EMPTY")
    @Min(value = 0, message = "Total price must be greater than or equal to 0")
    Long totalPrice;

    // finalPrice will be calculated on the backend based on totalPrice and voucher discount
}
