package com.harkins.startYourEngine.dto.request;

import java.time.LocalDate;

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
}
