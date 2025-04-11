package com.harkins.startYourEngine.dto.request;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.Size;

import com.harkins.startYourEngine.validator.DobConstraint;

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

    @DobConstraint(min = 18, message = "User must be at least 18 years old")
    LocalDate dob;

    List<String> roles;
}
