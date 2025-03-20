package com.harkins.startYourEngine.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Voucher {

    @Id
    private Long voucherId;

    private String voucherName;
    private String voucherDescription;
}
