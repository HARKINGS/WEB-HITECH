package com.harkins.startYourEngine.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import com.harkins.startYourEngine.validator.DobConstraint;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateUserRequest {
    @Size(min = 6, message = "INVALID_USERNAME")
    String username;

    @Size(min = 6, message = "INVALID_PASSWORD")
    String password;

    //    Không được bỏ trống
    @NotBlank(message = "NOT_EMPTY")
    String firstName;

    @NotBlank(message = "NOT_EMPTY")
    String lastName;

    @DobConstraint(min = 18, message = "INVALID_DOB")
    LocalDate dob;
}
