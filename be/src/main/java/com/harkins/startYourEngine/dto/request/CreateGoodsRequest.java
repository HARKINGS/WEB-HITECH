package com.harkins.startYourEngine.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateGoodsRequest {
    @NotBlank(message = "NOT_EMPTY")
    String goodsName;

    @NotBlank(message = "NOT_EMPTY")
    String goodsVersion;

    Long quantity;

    Long price;

    @NotBlank(message = "NOT_EMPTY")
    String goodsDescription;

    @NotBlank(message = "NOT_EMPTY")
    String goodsCategory;

    @NotBlank(message = "NOT_EMPTY")
    String goodsBrand;

    @NotBlank(message = "NOT_EMPTY")
    String goodsImageURL;
}
