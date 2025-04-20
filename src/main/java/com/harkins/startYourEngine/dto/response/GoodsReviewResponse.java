package com.harkins.startYourEngine.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoodsReviewResponse {
    private Long id;
    private String content;
    private int rating;
    private String createdAt;
    private String updatedAt;
    private String userName;
    private Long userId;
}
