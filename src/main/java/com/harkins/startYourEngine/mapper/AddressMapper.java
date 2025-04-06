package com.harkins.startYourEngine.mapper;

import com.harkins.startYourEngine.dto.request.SaveAndUpdateAddressRequest;
import com.harkins.startYourEngine.dto.response.AddressResponse;
import com.harkins.startYourEngine.entity.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AddressMapper {

    Address toAddress(SaveAndUpdateAddressRequest request);

    AddressResponse toAddressResponse(Address address);

    @Mapping(target = "user", ignore = true)       
    @Mapping(target = "fullAddress", expression = "java(buildFullAddress(request))")
    void updateAddress(@MappingTarget Address address, SaveAndUpdateAddressRequest request);

    // Phương thức build fullAddress kết hợp từ các trường riêng lẻ
    default String buildFullAddress(SaveAndUpdateAddressRequest request) {
        return String.format("%s, %s, %s, %s",
                request.getStreet(), request.getCity(), request.getState(), request.getCountry());
    }

    default String buildFullAddress(Address address) {
        return String.format("%s, %s, %s, %s",
                address.getStreet(), address.getCity(), address.getState(), address.getCountry());
    }
}
