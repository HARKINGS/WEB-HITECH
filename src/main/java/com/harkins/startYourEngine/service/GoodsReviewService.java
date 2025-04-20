package com.harkins.startYourEngine.service;

import java.util.Date;
import java.util.List;

import com.harkins.startYourEngine.entity.GoodsReview;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.harkins.startYourEngine.dto.request.CreateGoodsReviewRequest;
import com.harkins.startYourEngine.dto.request.UpdateGoodsReviewRequest;
import com.harkins.startYourEngine.dto.response.GoodsReviewResponse;
import com.harkins.startYourEngine.dto.response.UserResponse;
import com.harkins.startYourEngine.entity.Goods;
import com.harkins.startYourEngine.entity.User;
import com.harkins.startYourEngine.exception.AppException;
import com.harkins.startYourEngine.exception.ErrorCode;
import com.harkins.startYourEngine.mapper.GoodsReviewMapper;
import com.harkins.startYourEngine.repository.GoodsRepository;
import com.harkins.startYourEngine.repository.GoodsReviewRepository;
import com.harkins.startYourEngine.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoodsReviewService {

    private final GoodsReviewRepository goodsReviewRepository;
    private final GoodsRepository goodsRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final GoodsReviewMapper goodsReviewMapper;

    @Transactional
    public GoodsReviewResponse createReview(Long goodsId, CreateGoodsReviewRequest request) {
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
        if (goodsReviewRepository.existsByGoodsAndUser(goods, user)) {
            log.error("User {} has already reviewed goods {}", request.getUserId(), goodsId);
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        // Create new review
        GoodsReview goodsReview = GoodsReview.builder()
                .user(user)
                .goods(goods)
                .content(request.getContent())
                .rating(request.getRating())
                .createdAt(new Date())
                .build();

        // Save to database
        GoodsReview savedGoodsReview = goodsReviewRepository.save(goodsReview);
        log.info("Review created successfully with id: {}", savedGoodsReview.getId());

        // Convert to response and return
        return goodsReviewMapper.toReviewResponse(savedGoodsReview);
    }

    public GoodsReviewResponse getReviewById(Long reviewId) {
        log.info("Getting review with id: {}", reviewId);
        GoodsReview goodsReview = goodsReviewRepository.findById(reviewId).orElseThrow(() -> {
            log.error("Review not found with id: {}", reviewId);
            return new AppException(ErrorCode.REVIEW_NOT_FOUND);
        });
        return goodsReviewMapper.toReviewResponse(goodsReview);
    }

    public List<GoodsReviewResponse> getAllReviews() {
        List<GoodsReview> goodsReviews = goodsReviewRepository.findAll();
        return goodsReviews.stream().map(goodsReviewMapper::toReviewResponse).toList();
    }

    public List<GoodsReviewResponse> getReviewByGoods(Long goodsId) {
        if (!goodsRepository.existsById(goodsId)) {
            log.error("Goods not found with id: {}", goodsId);
            throw new AppException(ErrorCode.GOODS_NOT_FOUND);
        }
        List<GoodsReview> goodsReviews = goodsReviewRepository.findByGoods_GoodsId(goodsId);
        if (goodsReviews.isEmpty()) {
            log.warn("No reviews found for goods with id: {}", goodsId);
            throw new AppException(ErrorCode.GOODS_NOT_FOUND);
        }
        return goodsReviews.stream().map(goodsReviewMapper::toReviewResponse).toList();
    }

    @Transactional
    public GoodsReviewResponse updateGoodsReview(Long reviewId, UpdateGoodsReviewRequest request) {
        // Tìm review theo ID
        GoodsReview existingGoodsReview =
                goodsReviewRepository.findById(reviewId).orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        // Sử dụng userService.getMyInfo() để lấy thông tin người dùng hiện tại
        UserResponse currentUser = userService.getMyInfo();

        // Kiểm tra quyền sở hữu review
        if (!existingGoodsReview.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Cập nhật thông tin
        if (request.getContent() != null) {
            existingGoodsReview.setContent(request.getContent());
        }
        if (request.getRating() != null) {
            existingGoodsReview.setRating(request.getRating());
        }

        // Cập nhật thời gian
        existingGoodsReview.setUpdatedAt(new Date());

        // Lưu vào database
        GoodsReview updatedGoodsReview = goodsReviewRepository.save(existingGoodsReview);

        return goodsReviewMapper.toReviewResponse(updatedGoodsReview);
    }

    public void deleteGoodsReview(Long reviewId) {
        GoodsReview goodsReview =
                goodsReviewRepository.findById(reviewId).orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        // Sử dụng userService.getMyInfo() để lấy thông tin người dùng hiện tại
        UserResponse currentUser = userService.getMyInfo();

        // Kiểm tra quyền sở hữu review
        if (!goodsReview.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        goodsReviewRepository.delete(goodsReview);
    }
}
