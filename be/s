package com.harkins.startYourEngine.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.harkins.startYourEngine.dto.request.CreateGoodsReviewRequest;
import com.harkins.startYourEngine.dto.request.UpdateReviewRequest;
import com.harkins.startYourEngine.dto.response.ApiResponse;
import com.harkins.startYourEngine.dto.response.GoodsReviewResponse;
import com.harkins.startYourEngine.dto.response.UserResponse;
import com.harkins.startYourEngine.service.GoodsReviewService;
import com.harkins.startYourEngine.service.UserService;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@RequestMapping("/reviews")
public class ReviewController {
    private final GoodsReviewService goodsReviewService;
    private final UserService userService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<GoodsReviewResponse> createReview(@Valid @RequestBody CreateGoodsReviewRequest request) {
        UserResponse currentUser = userService.getMyInfo();
        log.info("Creating new review for goods: {}, user: {}", request.getGoodsId(), currentUser.getUserId());

        request.setUserId(currentUser.getUserId());

        return ApiResponse.<GoodsReviewResponse>builder()
                .result(goodsReviewService.createReview(request.getGoodsId(), request))
                .build();
    }

    @GetMapping("/{reviewId}")
    public ApiResponse<GoodsReviewResponse> getReviewById(@PathVariable("reviewId") Long reviewId) {
        log.info("Getting review with id: {}", reviewId);
        return ApiResponse.<GoodsReviewResponse>builder()
                .result(goodsReviewService.getReviewById(reviewId))
                .build();
    }

    @GetMapping
    public ApiResponse<List<GoodsReviewResponse>> getAllReviews() {
        log.info("Getting all reviews");
        return ApiResponse.<List<GoodsReviewResponse>>builder()
                .result(goodsReviewService.getAllReviews())
                .build();
    }

    @GetMapping("/goods-review/{goodsId}")
    public ApiResponse<List<GoodsReviewResponse>> getReviewByGoods(@PathVariable("goodsId") Long goodsId) {
        log.info("Fetching reviews for goods: {}", goodsId);
        return ApiResponse.<List<GoodsReviewResponse>>builder()
                .result(goodsReviewService.getReviewByGoods(goodsId))
                .build();
    }

    @PutMapping("/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<GoodsReviewResponse> updateReview(
            @PathVariable("reviewId") Long reviewId, @Valid @RequestBody UpdateReviewRequest request) {
        log.info("Updating review: {}", reviewId);

        return ApiResponse.<GoodsReviewResponse>builder()
                .result(goodsReviewService.updateGoodsReview(reviewId, request))
                .build();
    }

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<String> deleteReview(@PathVariable("reviewId") Long reviewId) {
        log.info("Deleting review: {}", reviewId);

        goodsReviewService.deleteGoodsReview(reviewId);
        return ApiResponse.<String>builder()
                .result("Review deleted successfully")
                .build();
    }
}
