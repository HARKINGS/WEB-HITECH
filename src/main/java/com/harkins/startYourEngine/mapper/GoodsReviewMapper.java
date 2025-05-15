package com.harkins.startYourEngine.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.harkins.startYourEngine.dto.request.CreateGoodsReviewRequest;
import com.harkins.startYourEngine.dto.request.UpdateGoodsReviewRequest;
import com.harkins.startYourEngine.dto.response.GoodsReviewResponse;
import com.harkins.startYourEngine.entity.GoodsReview;

@Mapper(componentModel = "spring")
public interface GoodsReviewMapper {
    GoodsReview toReview(CreateGoodsReviewRequest request);

    @Mapping(target = "userName", source = "userName")
    GoodsReviewResponse toReviewResponse(GoodsReview goodsReview);

    void updateReviewResponse(
            @MappingTarget GoodsReview goodsReview, UpdateGoodsReviewRequest updateGoodsReviewRequest);
}
