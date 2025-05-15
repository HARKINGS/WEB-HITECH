package com.harkins.startYourEngine.service;

import com.harkins.startYourEngine.dto.request.SaveAndUpdateAddressRequest;
import com.harkins.startYourEngine.dto.response.AddressResponse;
import com.harkins.startYourEngine.entity.Address;
import com.harkins.startYourEngine.mapper.AddressMapper;
import com.harkins.startYourEngine.repository.AddressRepository;
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
public class AddressService {

    AddressRepository addressRepository;
    AddressMapper addressMapper;

    @PreAuthorize("hasAuthority('SAVE_ADDRESS')")
    public AddressResponse saveAndUpdateAddress(SaveAndUpdateAddressRequest request) {
        Address address = addressMapper.toAddress(request);
        return addressMapper.toAddressResponse(addressRepository.save(address));
    }
}
