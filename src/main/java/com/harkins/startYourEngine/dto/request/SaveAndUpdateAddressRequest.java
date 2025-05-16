package com.harkins.startYourEngine.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SaveAndUpdateAddressRequest {
    @NotBlank(message = "NOT_EMPTY")
    String street;

    @NotBlank(message = "NOT_EMPTY")
    String city;

    @NotBlank(message = "NOT_EMPTY")
    String state;

    @NotBlank(message = "NOT_EMPTY")
    String country;
}
