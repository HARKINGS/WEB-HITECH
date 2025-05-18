package com.harkins.startYourEngine.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionRequest {
    @NotBlank(message = "NOT_EMPTY")
    String name;

    @NotBlank(message = "NOT_EMPTY")
    String description;
}
