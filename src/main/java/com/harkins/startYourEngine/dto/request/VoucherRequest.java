package com.harkins.startYourEngine.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VoucherRequest {
    @NotBlank(message = "NOT_EMPTY")
    Long identifiedVoucherId;

    @NotBlank(message = "NOT_EMPTY")
    LocalDate expiryDate;

    @NotBlank(message = "NOT_EMPTY")
    boolean validated;

    String voucherName;
    String voucherDescription;
}
