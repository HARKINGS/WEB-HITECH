package com.harkins.startYourEngine.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.harkins.startYourEngine.dto.request.CreateGoodsRequest;
import com.harkins.startYourEngine.dto.request.UpdateGoodsRequest;
import com.harkins.startYourEngine.dto.response.GoodsResponse;
import com.harkins.startYourEngine.entity.Goods;
import com.harkins.startYourEngine.mapper.GoodsMapper;
import com.harkins.startYourEngine.repository.GoodsRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoodsService {

    GoodsRepository goodsRepository;
    GoodsMapper goodsMapper;

    public GoodsResponse createGoods(CreateGoodsRequest request) {
        if(goodsRepository.existsByGoodsName(request.getGoodsName()))
            throw new RuntimeException("Goods already exists");
        Goods goods = goodsMapper.toGoods(request);
        return goodsMapper.toGoodsResponse(goodsRepository.save(goods));
    }

    public GoodsResponse getGoodsById(Long goodsId) {
        Goods goods = goodsRepository.findById(goodsId)
                .orElseThrow(() -> new RuntimeException("Goods not found!"));
        return goodsMapper.toGoodsResponse(goods);
    }

    public List<GoodsResponse> getGoodsByName(String goodsName) {
        List<Goods> goodsList = goodsRepository.findByGoodsNameContainingIgnoreCase(goodsName);

        if (goodsList.isEmpty()) {
            throw new EntityNotFoundException("No goods found with name '" + goodsName + "'");
        }

        return goodsList.stream()
                .map(goodsMapper::toGoodsResponse)
                .collect(Collectors.toList());
    }

    public List<GoodsResponse> getGoodsByCategory(String goodsCategory) {
        List<Goods> goodsList = goodsRepository.findByGoodsCategory(goodsCategory);

        if (goodsList.isEmpty()) {
            throw new EntityNotFoundException("No goods found with category '" + goodsCategory + "'");
        }

        return goodsList.stream()
                .map(goodsMapper::toGoodsResponse)
                .collect(Collectors.toList());
    }

    public List<GoodsResponse> getGoods() {
        return goodsRepository.findAll()
                .stream()
                .map(goodsMapper::toGoodsResponse)
                .toList();
    }

    public GoodsResponse updateGoods(Long goodsId, UpdateGoodsRequest request) {
        Goods goods = goodsRepository.findById(goodsId)
                .orElseThrow(() -> new RuntimeException("Goods not found!"));
        goodsMapper.updateGoods(goods, request);
        return goodsMapper.toGoodsResponse(goodsRepository.save(goods));
    }

    public void deleteGoods(Long goodsId) {
        goodsRepository.deleteById(goodsId);
    }

}
