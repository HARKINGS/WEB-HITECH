package com.harkins.startYourEngine.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.harkins.startYourEngine.dto.request.CreateGoodsRequest;
import com.harkins.startYourEngine.dto.request.UpdateGoodsRequest;
import com.harkins.startYourEngine.dto.response.GoodsResponse;
import com.harkins.startYourEngine.entity.Goods;
import com.harkins.startYourEngine.exception.AppException;
import com.harkins.startYourEngine.exception.ErrorCode;
import com.harkins.startYourEngine.mapper.GoodsMapper;
import com.harkins.startYourEngine.repository.GoodsRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GoodsService {

    GoodsRepository goodsRepository;
    GoodsMapper goodsMapper;

    @PreAuthorize("hasAuthority('GET_GOODS_BY_RATING')")
    public List<GoodsResponse> getGoodsByMinRating(int minRating) {
        return goodsRepository.findByAverageRatingGreaterThanEqual(minRating).stream()
                .map(goodsMapper::toGoodsResponse)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('GET_GOODS_SORTED')")
    public List<GoodsResponse> getGoodsSortedByNameAsc() {
        return goodsRepository.findAllByOrderByGoodsNameAsc().stream()
                .map(goodsMapper::toGoodsResponse)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('GET_GOODS_SORTED')")
    public List<GoodsResponse> getGoodsSortedByNameDesc() {
        return goodsRepository.findAllByOrderByGoodsNameDesc().stream()
                .map(goodsMapper::toGoodsResponse)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('CREATE_GOODS')")
    public GoodsResponse createGoods(CreateGoodsRequest request) {
        if (goodsRepository.existsByGoodsName(request.getGoodsName())) throw new AppException(ErrorCode.GOODS_EXISTED);
        Goods goods = goodsMapper.toGoods(request);
        return goodsMapper.toGoodsResponse(goodsRepository.save(goods));
    }

    @PreAuthorize("hasAuthority('GET_GOODS_BY_ID')")
    public GoodsResponse getGoodsById(String goodsId) {
        Goods goods = goodsRepository.findById(goodsId).orElseThrow(() -> new AppException(ErrorCode.GOODS_NOT_FOUND));
        return goodsMapper.toGoodsResponse(goods);
    }

    @PreAuthorize("hasAuthority('GET_GOODS_BY_NAME')")
    public List<GoodsResponse> getGoodsByName(String goodsName) {
        List<Goods> goodsList = goodsRepository.findByGoodsNameContainingIgnoreCase(goodsName);

        if (goodsList.isEmpty()) throw new AppException(ErrorCode.GOODS_NOT_FOUND);

        return goodsList.stream().map(goodsMapper::toGoodsResponse).collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('GET_GOODS_BY_CATEGORY')")
    public List<GoodsResponse> getGoodsByCategory(String goodsCategory) {
        List<Goods> goodsList = goodsRepository.findByGoodsCategory(goodsCategory);

        if (goodsList.isEmpty()) throw new AppException(ErrorCode.GOODS_NOT_FOUND);

        return goodsList.stream().map(goodsMapper::toGoodsResponse).collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('GET_ALL_GOODS')")
    public List<GoodsResponse> getGoods() {
        return goodsRepository.findAll().stream()
                .map(goodsMapper::toGoodsResponse)
                .toList();
    }

    @PreAuthorize("hasAuthority('UPDATE_GOODS')")
    public GoodsResponse updateGoods(String goodsId, UpdateGoodsRequest request) {
        Goods goods = goodsRepository.findById(goodsId).orElseThrow(() -> new AppException(ErrorCode.GOODS_NOT_FOUND));
        goodsMapper.updateGoods(goods, request);
        return goodsMapper.toGoodsResponse(goodsRepository.save(goods));
    }

    @PreAuthorize("hasAuthority('DELETE_GOODS')")
    public void deleteGoods(String goodsId) {
        goodsRepository.deleteById(goodsId);
    }

    @PreAuthorize("hasAuthority('GET_GOODS_BY_PRICE')")
    public List<GoodsResponse> getGoodsByPrice(Long price) {
        List<Goods> goodsList = goodsRepository.findByPrice(price);
        return goodsList.stream().map(goodsMapper::toGoodsResponse).collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('GET_GOODS_BY_PRICE_RANGE')")
    public List<GoodsResponse> getGoodsByPriceRange(Long minPrice, Long maxPrice) {
        List<Goods> goodsList = goodsRepository.findByPriceBetween(minPrice, maxPrice);
        return goodsList.stream().map(goodsMapper::toGoodsResponse).collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('GET_GOODS_BY_BRANCH')")
    public List<GoodsResponse> getGoodsByBrand(String goodsBrand) {
        List<Goods> goodsList = goodsRepository.findByGoodsBrand(goodsBrand);
        return goodsList.stream().map(goodsMapper::toGoodsResponse).collect(Collectors.toList());
    }
}
