package com.harkins.startYourEngine.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// @Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    //    private final ReviewRepository reviewRepository;
    //    private final GoodsRepository goodsRepository;
    //    private final UserRepository userRepository;
    //    private final ReviewMapper reviewMapper;
    //
    //    public ReviewResponse createReview(CreateReviewRequest request) {
    //        // Validate goods exists
    //        Goods goods = goodsRepository.findById(request.getGoodsId()).orElseThrow(() -> {
    //            log.error("Goods not found with id: {}", request.getGoodsId());
    //            return new AppException(ErrorCode.GOODS_NOT_FOUND);
    //        });
    //
    //        // Validate user exists
    //        User user = userRepository.findById(request.getUserId()).orElseThrow(() -> {
    //            log.error("User not found with id: {}", request.getUserId());
    //            return new AppException(ErrorCode.USER_NOT_FOUND);
    //        });
    //
    //        // Create new review
    //        Review review = Review.builder()
    //                .user(user)
    //                .good(goods)
    //                .content(request.getContent())
    //                .rating(request.getRating())
    //                .createdAt(new Date())
    //                .build();
    //
    //        // Save to database
    //        Review savedReview = reviewRepository.save(review);
    //        log.info("Review created successfully with id: {}", savedReview.getId());
    //
    //        // Convert to response and return
    //        return reviewMapper.toReviewResponse(savedReview);
    //    }
    //
    //    public ReviewResponse getReviewById(Long reviewId) {
    //        log.info("Getting review with id: {}", reviewId);
    //        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> {
    //            log.error("Review not found with id: {}", reviewId);
    //            return new AppException(ErrorCode.REVIEW_NOT_FOUND);
    //        });
    //        return reviewMapper.toReviewResponse(review);
    //    }
    //
    //    public List<ReviewResponse> getAllReviews() {
    //        List<Review> reviews = reviewRepository.findAll();
    //        return reviews.stream().map(reviewMapper::toReviewResponse).toList();
    //    }
    //
    //    public List<ReviewResponse> getReviewByGoods(Long id) {
    //        if (!goodsRepository.existsById(id)) {
    //            log.error("Goods not found with id: {}", id);
    //            throw new AppException(ErrorCode.GOODS_NOT_FOUND);
    //        }
    //        List<Review> reviews = reviewRepository.findByGoodsId(id);
    //        if (reviews.isEmpty()) {
    //            log.warn("No reviews found for goods with id: {}", id);
    //            throw new AppException(ErrorCode.GOODS_NOT_FOUND);
    //        }
    //        return reviews.stream().map(reviewMapper::toReviewResponse).toList();
    //    }
    //
    //    public ReviewResponse updateReview(Long id, UpdateReviewRequest request) {
    //        Review review = reviewRepository.findById(id).orElseThrow(() -> new
    // AppException(ErrorCode.REVIEW_NOT_FOUND));
    //
    //        // Update only allowed fields
    //        if (request.getContent() != null) {
    //            review.setContent(request.getContent());
    //        }
    //        if (request.getRating() != null) {
    //            review.setRating(request.getRating());
    //        }
    //
    //        Review updatedReview = reviewRepository.save(review);
    //        return reviewMapper.toReviewResponse(updatedReview);
    //    }
    //
    //    public void deleteReview(Long id) {
    //        Review review = reviewRepository.findById(id).orElseThrow(() -> new
    // AppException(ErrorCode.REVIEW_NOT_FOUND));
    //        reviewRepository.delete(review);
    //    }
}
