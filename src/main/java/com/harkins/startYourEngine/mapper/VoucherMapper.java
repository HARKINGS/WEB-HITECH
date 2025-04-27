package com.harkins.startYourEngine.mapper;

import com.harkins.startYourEngine.dto.request.VoucherRequest;
import com.harkins.startYourEngine.dto.response.VoucherResponse;
import com.harkins.startYourEngine.entity.Voucher;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface VoucherMapper {
    Voucher toVoucher(VoucherRequest request);
    VoucherResponse toVoucherResponse(Voucher voucher);
}
