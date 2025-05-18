package com.harkins.startYourEngine.dto.request;

import java.time.LocalDate;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateUserRequest {
    //    @Size(min = 6, message = "INVALID_PASSWORD")
    String password;

    //    @NotBlank(message = "NOT_EMPTY")
    String firstName;

    //    @NotBlank(message = "NOT_EMPTY")
    String lastName;

    //    @DobConstraint(min = 18, message = "INVALID_DOB")
    LocalDate dob;

    List<String> roles;
}
