package com.harkins.startYourEngine.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateGoodsRequest {
    String goodsName;
    String goodsVersion;
    Long quantity;
    Double price;
    String goodsDescription;
    String goodsCategory;
    String goodsBrand;
    String goodsImageURL;
}
