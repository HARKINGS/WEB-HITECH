package com.harkins.startYourEngine.dto.request;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateUserRequest {
    @Size(min = 6, message = "Password must be at least 6 characters")
    String password;

    String firstName;
    String lastName;

    LocalDate dob;

    List<String> roles;
}
