package com.harkins.startYourEngine.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.harkins.startYourEngine.entity.Voucher;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    Voucher findByIdentifiedVoucherId(Long identifiedVoucherId);

    boolean existsByIdentifiedVoucherId(Long identifiedVoucherId);
}
