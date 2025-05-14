package com.harkins.startYourEngine.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentRequest {
    @NotBlank(message = "NOT_EMPTY")
    private String status;
    @NotBlank(message = "NOT_EMPTY")
    private String message;
    @NotBlank(message = "NOT_EMPTY")
    private String URL;
}
