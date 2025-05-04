package com.harkins.startYourEngine.controller;

import com.harkins.startYourEngine.dto.request.VoucherRequest;
import com.harkins.startYourEngine.dto.response.ApiResponse;
import com.harkins.startYourEngine.dto.response.VoucherResponse;
import com.harkins.startYourEngine.service.VoucherService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Builder
@RequestMapping("/vouchers")
public class VoucherController {
    VoucherService voucherService;

    @PostMapping
    ApiResponse<VoucherResponse> createVoucher(@Valid VoucherRequest request) {
        return ApiResponse.<VoucherResponse>builder()
                .result(voucherService.createVoucher(request))
                .build();
    }

    @GetMapping("{voucherId}")
    ApiResponse<VoucherResponse> getVoucher(@PathVariable("voucherId") String voucherId) {
        return ApiResponse.<VoucherResponse>builder()
                .result(voucherService.getVoucher(voucherId))
                .build();
    }

    @DeleteMapping("{voucherId}")
    ApiResponse<String> deleteVoucher(@PathVariable("voucherId") String voucherId) {
        voucherService.deleteVoucher(voucherId);
        return ApiResponse.<String>builder()
                .result("Voucher deleted!")
                .build();
    }
}
