package com.harkins.startYourEngine.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.harkins.startYourEngine.dto.request.CreateReviewRequest;
import com.harkins.startYourEngine.dto.request.UpdateReviewRequest;
import com.harkins.startYourEngine.dto.response.ApiResponse;
import com.harkins.startYourEngine.dto.response.ReviewResponse;
import com.harkins.startYourEngine.service.ReviewService;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@RequestMapping("/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping
    public ApiResponse<ReviewResponse> createReview(@Valid @RequestBody CreateReviewRequest request) {
        log.info("Creating new review for goods: {}", request.getGoodsId());
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.createReview(request))
                .build();
    }

    @GetMapping("/{reviewId}")
    public ApiResponse<ReviewResponse> getReviewById(@PathVariable("reviewId") Long reviewId) {
        log.info("Getting review with id: {}", reviewId);
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.getReviewById(reviewId))
                .build();
    }

    @GetMapping
    public ApiResponse<List<ReviewResponse>> getAllReviews() {
        log.info("Getting all reviews");
        return ApiResponse.<List<ReviewResponse>>builder()
                .result(reviewService.getAllReviews())
                .build();
    }

    @GetMapping("/goods-review/{goodsId}")
    public ApiResponse<List<ReviewResponse>> getReviewByGoods(@PathVariable("goodsId") Long goodsId) {
        log.info("Fetching reviews for goods: {}", goodsId);
        return ApiResponse.<List<ReviewResponse>>builder()
                .result(reviewService.getReviewByGoods(goodsId))
                .build();
    }

    @PutMapping("/{reviewId}")
    public ApiResponse<ReviewResponse> updateReview(
            @PathVariable("reviewId") Long reviewId, @Valid @RequestBody UpdateReviewRequest request) {
        log.info("Updating review: {}", reviewId);
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.updateReview(reviewId, request))
                .build();
    }

    @DeleteMapping("/{reviewId}")
    public ApiResponse<String> deleteReview(@PathVariable("reviewId") Long reviewId) {
        log.info("Deleting review: {}", reviewId);
        reviewService.deleteReview(reviewId);
        return ApiResponse.<String>builder()
                .result("Review deleted successfully")
                .build();
    }
}
