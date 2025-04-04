package com.harkins.startYourEngine.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.harkins.startYourEngine.dto.request.SaveAndUpdateAddressRequest;
import com.harkins.startYourEngine.dto.response.AddressResponse;
import com.harkins.startYourEngine.dto.response.ApiResponse;
import com.harkins.startYourEngine.service.AddressService;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Builder
@RequestMapping("/address")
public class AddressController {

    AddressService addressService;

    @PostMapping("/save")
    ApiResponse<AddressResponse> saveAndUpdateAddress(@Valid @RequestBody SaveAndUpdateAddressRequest request) {
        return ApiResponse.<AddressResponse>builder()
                .result(addressService.saveAndUpdateAddress(request))
                .build();
    }
}
