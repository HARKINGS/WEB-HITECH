package com.harkins.startYourEngine.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VoucherResponse {
    Long voucherId;
    Long identifiedVoucherId;
    LocalDate expiryDate;
    boolean validated;

    String voucherName;
    String voucherDescription;
}
