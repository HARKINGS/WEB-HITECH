package com.harkins.startYourEngine.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GoodsReviewResponse {
    String id;
    String content;
    //    double rating;
    int rating;
    String createdAt;
    String updatedAt;
    String userName;
    String goodsId;
}
