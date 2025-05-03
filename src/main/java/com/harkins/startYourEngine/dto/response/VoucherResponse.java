package com.harkins.startYourEngine.dto.response;

import java.time.LocalDate;

import lombok.*;
import lombok.experimental.FieldDefaults;

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
