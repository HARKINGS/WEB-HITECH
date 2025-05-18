package com.harkins.startYourEngine.mapper;

import org.mapstruct.Mapper;

import com.harkins.startYourEngine.dto.request.VoucherRequest;
import com.harkins.startYourEngine.dto.response.VoucherResponse;
import com.harkins.startYourEngine.entity.Voucher;

@Mapper(componentModel = "spring")
public interface VoucherMapper {
    Voucher toVoucher(VoucherRequest request);

    VoucherResponse toVoucherResponse(Voucher voucher);
}
