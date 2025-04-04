package com.harkins.startYourEngine.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.harkins.startYourEngine.dto.request.CreateReviewRequest;
import com.harkins.startYourEngine.dto.request.UpdateReviewRequest;
import com.harkins.startYourEngine.dto.response.ReviewResponse;
import com.harkins.startYourEngine.entity.Review;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    Review toReview(CreateReviewRequest request);

    @Mapping(target = "userId", source = "user.userId")
    ReviewResponse toReviewResponse(Review review);

    void updateReviewResponse(@MappingTarget Review review, UpdateReviewRequest updateReviewRequest);
}
