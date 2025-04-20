package com.harkins.startYourEngine.mapper;

import com.harkins.startYourEngine.entity.GoodsReview;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.harkins.startYourEngine.dto.request.CreateGoodsReviewRequest;
import com.harkins.startYourEngine.dto.request.UpdateReviewRequest;
import com.harkins.startYourEngine.dto.response.GoodsReviewResponse;

@Mapper(componentModel = "spring")
public interface GoodsReviewMapper {
    GoodsReview toReview(CreateGoodsReviewRequest request);

    @Mapping(target = "userId", source = "user.userId")
    GoodsReviewResponse toReviewResponse(GoodsReview goodsReview);

    void updateReviewResponse(@MappingTarget GoodsReview goodsReview, UpdateReviewRequest updateReviewRequest);
}
