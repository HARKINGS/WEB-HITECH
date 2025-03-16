package com.harkins.startYourEngine.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

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

}
