package com.harkins.startYourEngine.service;

import java.util.Date;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.harkins.startYourEngine.dto.request.CreateGoodsReviewRequest;
import com.harkins.startYourEngine.dto.request.UpdateGoodsReviewRequest;
import com.harkins.startYourEngine.dto.response.GoodsReviewResponse;
import com.harkins.startYourEngine.entity.Goods;
import com.harkins.startYourEngine.entity.GoodsReview;
import com.harkins.startYourEngine.exception.AppException;
import com.harkins.startYourEngine.exception.ErrorCode;
import com.harkins.startYourEngine.mapper.GoodsReviewMapper;
import com.harkins.startYourEngine.repository.GoodsRepository;
import com.harkins.startYourEngine.repository.GoodsReviewRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GoodsReviewService {

    GoodsReviewRepository goodsReviewRepository;
    GoodsRepository goodsRepository;
    GoodsReviewMapper goodsReviewMapper;

    @PreAuthorize("hasAuthority('CREATE_REVIEWS')")
    @Transactional
    public GoodsReviewResponse createReview(String goodsId, CreateGoodsReviewRequest request) {
        Goods goods = goodsRepository.findById(goodsId).orElseThrow(() -> new AppException(ErrorCode.GOODS_NOT_FOUND));

        if (goodsReviewRepository.existsByGoodsAndUserName(goods, request.getUserName())) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        GoodsReview goodsReview = GoodsReview.builder()
                .userName(request.getUserName())
                .goods(goods)
                .content(request.getContent())
                .rating(request.getRating())
                .createdAt(new Date())
                .build();

        GoodsReview savedGoodsReview = goodsReviewRepository.save(goodsReview);
        return goodsReviewMapper.toReviewResponse(savedGoodsReview);
    }

    @PreAuthorize("hasAuthority('GET_REVIEWS_BY_ID')")
    public GoodsReviewResponse getReviewById(String reviewId) {
        GoodsReview goodsReview = goodsReviewRepository
                .findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
        return goodsReviewMapper.toReviewResponse(goodsReview);
    }

    @PreAuthorize("hasAuthority('GET_ALL_REVIEWS')")
    public List<GoodsReviewResponse> getAllReviews() {
        return goodsReviewRepository.findAll().stream()
                .map(goodsReviewMapper::toReviewResponse)
                .toList();
    }

    @PreAuthorize("hasAuthority('GET_REVIEWS_BY_GOODS')")
    public List<GoodsReviewResponse> getReviewByGoods(String goodsId) {
        return goodsReviewRepository.findByGoods_GoodsId(goodsId).stream()
                .map(goodsReviewMapper::toReviewResponse)
                .toList();
    }

    @PreAuthorize("hasAuthority('UPDATE_REVIEWS')")
    @Transactional
    public GoodsReviewResponse updateGoodsReview(String reviewId, UpdateGoodsReviewRequest request) {
        GoodsReview existingGoodsReview = goodsReviewRepository
                .findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        if (request.getContent() != null) {
            existingGoodsReview.setContent(request.getContent());
        }
        if (request.getRating() != null) {
            existingGoodsReview.setRating(request.getRating());
        }

        existingGoodsReview.setUpdatedAt(new Date());
        GoodsReview updatedGoodsReview = goodsReviewRepository.save(existingGoodsReview);
        return goodsReviewMapper.toReviewResponse(updatedGoodsReview);
    }

    @PreAuthorize("hasAuthority('DELETE_REVIEWS')")
    public void deleteGoodsReview(String reviewId) {
        goodsReviewRepository.deleteById(reviewId);
    }
}
