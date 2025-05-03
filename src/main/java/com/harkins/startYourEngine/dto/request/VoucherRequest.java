package com.harkins.startYourEngine.dto.request;

import java.time.LocalDate;

import lombok.*;
import lombok.experimental.FieldDefaults;

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
