package com.harkins.startYourEngine.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VoucherRequest {
    Long identifiedVoucherId;
    LocalDate expiryDate;
    boolean validated;

    String voucherName;
    String voucherDescription;
}
