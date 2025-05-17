package com.harkins.startYourEngine.dto.request;

import java.util.Date;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateGoodsReviewRequest {
    @NotBlank(message = "NOT_EMPTY")
    String goodsId;

    @NotBlank(message = "NOT_EMPTY")
    String userName;

    @NotBlank(message = "NOT_EMPTY")
    String content;

    @NotBlank(message = "NOT_EMPTY")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    Integer rating;
//    double rating;

    @NotBlank(message = "NOT_EMPTY")
    Date createdAt;
}
