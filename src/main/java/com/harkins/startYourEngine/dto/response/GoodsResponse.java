package com.harkins.startYourEngine.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GoodsResponse {
    String goodsId;
    String goodsName;
    String goodsVersion;
    Long quantity;
    Long price;
    String goodsDescription;
    String goodsCategory;
    String goodsImageURL;
}
