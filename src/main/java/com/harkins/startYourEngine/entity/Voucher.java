package com.harkins.startYourEngine.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Voucher {
    // thêm trạng thái đã sử dụng hay chưa (sử dụng rồi thì xoá đi, cần chi nữa)
    // thêm mã giảm giá
    // thêm loại giảm giá (tiền mặt hay phần trăm)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    Long identifiedVoucherId;
    LocalDate expiryDate;
    boolean validated;

    String voucherName;
    String voucherDescription;
}
