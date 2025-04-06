package com.harkins.startYourEngine.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GoodsResponse {
    private Long goodsId;

    String goodsName;
    String goodsVersion;
    Long quantity;
    Double price;
    String goodsDescription;
    String goodsCategory;
    String goodsBrand;
    String goodsImageURL;
}
