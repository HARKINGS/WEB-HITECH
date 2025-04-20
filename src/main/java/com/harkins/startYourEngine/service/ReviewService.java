package com.harkins.startYourEngine.service;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.harkins.startYourEngine.dto.request.CreateReviewRequest;
import com.harkins.startYourEngine.dto.request.UpdateReviewRequest;
import com.harkins.startYourEngine.dto.response.ReviewResponse;
import com.harkins.startYourEngine.dto.response.UserResponse;
import com.harkins.startYourEngine.entity.Goods;
import com.harkins.startYourEngine.entity.Review;
import com.harkins.startYourEngine.entity.User;
import com.harkins.startYourEngine.exception.AppException;
import com.harkins.startYourEngine.exception.ErrorCode;
import com.harkins.startYourEngine.mapper.ReviewMapper;
import com.harkins.startYourEngine.repository.GoodsRepository;
import com.harkins.startYourEngine.repository.ReviewRepository;
import com.harkins.startYourEngine.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final GoodsRepository goodsRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final ReviewMapper reviewMapper;

    @Transactional
    public ReviewResponse createReview(Long goodsId, CreateReviewRequest request) {
        // Validate goods exists
        Goods goods = goodsRepository.findById(goodsId).orElseThrow(() -> {
            log.error("Goods not found with id: {}", goodsId);
            return new AppException(ErrorCode.GOODS_NOT_FOUND);
        });

        // Validate user exists
        User user = userRepository.findById(request.getUserId()).orElseThrow(() -> {
            log.error("User not found with id: {}", request.getUserId());
            return new AppException(ErrorCode.USER_NOT_FOUND);
        });

        // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
        if (reviewRepository.existsByGoodsAndUser(goods, user)) {
            log.error("User {} has already reviewed goods {}", request.getUserId(), goodsId);
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        // Create new review
        Review review = Review.builder()
                .user(user)
                .goods(goods)
                .content(request.getContent())
                .rating(request.getRating())
                .createdAt(new Date())
                .build();

        // Save to database
        Review savedReview = reviewRepository.save(review);
        log.info("Review created successfully with id: {}", savedReview.getId());

        // Convert to response and return
        return reviewMapper.toReviewResponse(savedReview);
    }

    public ReviewResponse getReviewById(Long reviewId) {
        log.info("Getting review with id: {}", reviewId);
        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> {
            log.error("Review not found with id: {}", reviewId);
            return new AppException(ErrorCode.REVIEW_NOT_FOUND);
        });
        return reviewMapper.toReviewResponse(review);
    }

    public List<ReviewResponse> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        return reviews.stream().map(reviewMapper::toReviewResponse).toList();
    }

    public List<ReviewResponse> getReviewByGoods(Long goodsId) {
        if (!goodsRepository.existsById(goodsId)) {
            log.error("Goods not found with id: {}", goodsId);
            throw new AppException(ErrorCode.GOODS_NOT_FOUND);
        }
        List<Review> reviews = reviewRepository.findByGoods_GoodsId(goodsId);
        if (reviews.isEmpty()) {
            log.warn("No reviews found for goods with id: {}", goodsId);
            throw new AppException(ErrorCode.GOODS_NOT_FOUND);
        }
        return reviews.stream().map(reviewMapper::toReviewResponse).toList();
    }

    @Transactional
    public ReviewResponse updateReview(Long reviewId, UpdateReviewRequest request) {
        // Tìm review theo ID
        Review existingReview =
                reviewRepository.findById(reviewId).orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        // Sử dụng userService.getMyInfo() để lấy thông tin người dùng hiện tại
        UserResponse currentUser = userService.getMyInfo();

        // Kiểm tra quyền sở hữu review
        if (!existingReview.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Cập nhật thông tin
        if (request.getContent() != null) {
            existingReview.setContent(request.getContent());
        }
        if (request.getRating() != null) {
            existingReview.setRating(request.getRating());
        }

        // Cập nhật thời gian
        existingReview.setUpdatedAt(new Date());

        // Lưu vào database
        Review updatedReview = reviewRepository.save(existingReview);

        return reviewMapper.toReviewResponse(updatedReview);
    }

    public void deleteReview(Long reviewId) {
        Review review =
                reviewRepository.findById(reviewId).orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        // Sử dụng userService.getMyInfo() để lấy thông tin người dùng hiện tại
        UserResponse currentUser = userService.getMyInfo();

        // Kiểm tra quyền sở hữu review
        if (!review.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        reviewRepository.delete(review);
    }
}
