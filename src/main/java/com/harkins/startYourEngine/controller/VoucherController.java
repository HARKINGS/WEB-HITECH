package com.harkins.startYourEngine.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.harkins.startYourEngine.dto.request.VoucherRequest;
import com.harkins.startYourEngine.dto.response.ApiResponse;
import com.harkins.startYourEngine.dto.response.VoucherResponse;
import com.harkins.startYourEngine.service.VoucherService;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.concurrent.ThreadPoolExecutor;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Builder
@RequestMapping("/vouchers")
public class VoucherController {
    VoucherService voucherService;

    @PostMapping
    public ApiResponse<VoucherResponse> createVoucher(@Valid @RequestBody VoucherRequest request) {
        return ApiResponse.<VoucherResponse>builder()
                .result(voucherService.createVoucher(request))
                .build();
    }

    @GetMapping("{voucherId}")
    public ApiResponse<VoucherResponse> getVoucher(@PathVariable("voucherId") String voucherId) {
        return ApiResponse.<VoucherResponse>builder()
                .result(voucherService.getVoucher(voucherId))
                .build();
    }

    @GetMapping
    public ApiResponse<List<VoucherResponse>> getAllVouchers() {
        return ApiResponse.<List<VoucherResponse>>builder()
                .result(voucherService.getAllVouchers())
                .build();
    }

    @DeleteMapping("{voucherId}")
    public ApiResponse<String> deleteVoucher(@PathVariable("voucherId") String voucherId) {
        voucherService.deleteVoucher(voucherId);
        return ApiResponse.<String>builder().result("Voucher deleted!").build();
    }
}
