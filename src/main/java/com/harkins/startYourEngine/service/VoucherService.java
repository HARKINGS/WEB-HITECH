package com.harkins.startYourEngine.service;

import com.harkins.startYourEngine.dto.request.VoucherRequest;
import com.harkins.startYourEngine.dto.response.VoucherResponse;
import com.harkins.startYourEngine.entity.Voucher;
import com.harkins.startYourEngine.exception.AppException;
import com.harkins.startYourEngine.exception.ErrorCode;
import com.harkins.startYourEngine.mapper.VoucherMapper;
import com.harkins.startYourEngine.repository.VoucherRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class VoucherService {
    VoucherRepository voucherRepository;
    VoucherMapper voucherMapper;

    @PreAuthorize("hasAuthority('CREATE_VOUCHER')")
    public VoucherResponse createVoucher(VoucherRequest request) {
        if (voucherRepository.existsByIdentifiedVoucherId(request.getIdentifiedVoucherId()))
            throw new AppException(ErrorCode.VOUCHER_EXISTED);

        Voucher voucher = voucherMapper.toVoucher(request);
        return voucherMapper.toVoucherResponse(voucherRepository.save(voucher));
    }

    @PreAuthorize("hasAuthority('GET_VOUCHER')")
    public VoucherResponse getVoucher(String voucherId) {
        //        Voucher voucher = voucherRepository.findByIdentifiedVoucherId(identifiedVoucherId);
        Voucher voucher =
                voucherRepository.findById(voucherId).orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        return voucherMapper.toVoucherResponse(voucher);
    }

    @PreAuthorize("hasAuthority('DELETE_VOUCHER')")
    public void deleteVoucher(String voucherId) {
        voucherRepository.deleteById(voucherId);
    }
}
