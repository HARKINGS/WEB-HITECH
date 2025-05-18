package com.harkins.startYourEngine.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VoucherRequest {
    @NotNull(message = "NOT_EMPTY")
    Long identifiedVoucherId;

    @NotNull(message = "NOT_EMPTY")
    LocalDate expiryDate;

    @NotNull(message = "NOT_EMPTY")
    boolean validated;

    @NotBlank(message = "NOT_EMPTY")
    String voucherName;

    @NotBlank(message = "NOT_EMPTY")
    String voucherDescription;

    @NotNull(message = "NOT_EMPTY")
    @Min(value = 0, message = "Discount amount must be greater than or equal to 0")
    @Max(value = 100, message = "Discount amount must be less than or equal to 100")
    Double discountAmount;
}
