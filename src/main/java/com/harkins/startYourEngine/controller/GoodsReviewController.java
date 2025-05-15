package com.harkins.startYourEngine.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PathVariable;

import com.harkins.startYourEngine.dto.request.CreateGoodsReviewRequest;
import com.harkins.startYourEngine.dto.request.UpdateGoodsReviewRequest;
import com.harkins.startYourEngine.dto.response.ApiResponse;
import com.harkins.startYourEngine.dto.response.GoodsReviewResponse;
import com.harkins.startYourEngine.service.GoodsReviewService;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@RequestMapping("/reviews")
public class GoodsReviewController {
    GoodsReviewService goodsReviewService;

    @PostMapping("/create")
    public ApiResponse<GoodsReviewResponse> createReview(@Valid @RequestBody CreateGoodsReviewRequest request) {
        return ApiResponse.<GoodsReviewResponse>builder()
                .result(goodsReviewService.createReview(request.getGoodsId(), request))
                .build();
    }

    @GetMapping("/{reviewId}")
    public ApiResponse<GoodsReviewResponse> getReviewById(@PathVariable("reviewId") String reviewId) {
        return ApiResponse.<GoodsReviewResponse>builder()
                .result(goodsReviewService.getReviewById(reviewId))
                .build();
    }

    @GetMapping("/all")
    public ApiResponse<List<GoodsReviewResponse>> getAllReviews() {
        return ApiResponse.<List<GoodsReviewResponse>>builder()
                .result(goodsReviewService.getAllReviews())
                .build();
    }

    @GetMapping("/goods-review/{goodsId}")
    public ApiResponse<List<GoodsReviewResponse>> getReviewByGoods(@PathVariable("goodsId") String goodsId) {
        return ApiResponse.<List<GoodsReviewResponse>>builder()
                .result(goodsReviewService.getReviewByGoods(goodsId))
                .build();
    }

    @PutMapping("/{reviewId}")
    public ApiResponse<GoodsReviewResponse> updateReview(
            @PathVariable("reviewId") String reviewId, @Valid @RequestBody UpdateGoodsReviewRequest request) {
        return ApiResponse.<GoodsReviewResponse>builder()
                .result(goodsReviewService.updateGoodsReview(reviewId, request))
                .build();
    }

    @DeleteMapping("/{reviewId}")
    public ApiResponse<String> deleteReview(@PathVariable("reviewId") String reviewId) {
        goodsReviewService.deleteGoodsReview(reviewId);
        return ApiResponse.<String>builder()
                .result("Review deleted successfully")
                .build();
    }
}
