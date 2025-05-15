package com.harkins.startYourEngine.service;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.harkins.startYourEngine.dto.request.CreateGoodsRequest;
import com.harkins.startYourEngine.dto.request.UpdateGoodsRequest;
import com.harkins.startYourEngine.dto.response.GoodsResponse;
import com.harkins.startYourEngine.entity.Goods;
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

    @PreAuthorize("hasAuthority('CREATE_GOODS')")
    public GoodsResponse createGoods(CreateGoodsRequest request) {
        if (goodsRepository.existsByGoodsName(request.getGoodsName()))
            throw new RuntimeException("Goods already exists");
        Goods goods = goodsMapper.toGoods(request);
        return goodsMapper.toGoodsResponse(goodsRepository.save(goods));
    }

    @PreAuthorize("hasAuthority('GET_GOODS_BY_ID')")
    public GoodsResponse getGoodsById(String goodsId) {
        Goods goods = goodsRepository.findById(goodsId).orElseThrow(() -> new RuntimeException("Goods not found!"));
        return goodsMapper.toGoodsResponse(goods);
    }

    @PreAuthorize("hasAuthority('GET_GOODS_BY_NAME')")
    public List<GoodsResponse> getGoodsByName(String goodsName) {
        List<Goods> goodsList = goodsRepository.findByGoodsNameContainingIgnoreCase(goodsName);

        if (goodsList.isEmpty()) {
            throw new EntityNotFoundException("No goods found with name '" + goodsName + "'");
        }

        return goodsList.stream().map(goodsMapper::toGoodsResponse).collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('GET_GOODS_BY_CATEGORY')")
    public List<GoodsResponse> getGoodsByCategory(String goodsCategory) {
        List<Goods> goodsList = goodsRepository.findByGoodsCategory(goodsCategory);

        if (goodsList.isEmpty()) {
            throw new EntityNotFoundException("No goods found with category '" + goodsCategory + "'");
        }

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
        Goods goods = goodsRepository.findById(goodsId).orElseThrow(() -> new RuntimeException("Goods not found!"));
        goodsMapper.updateGoods(goods, request);
        return goodsMapper.toGoodsResponse(goodsRepository.save(goods));
    }

    @PreAuthorize("hasAuthority('DELETE_GOODS')")
    public void deleteGoods(String goodsId) {
        goodsRepository.deleteById(goodsId);
    }
}
