package com.harkins.startYourEngine.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.harkins.startYourEngine.dto.request.CreateGoodsRequest;
import com.harkins.startYourEngine.dto.request.UpdateGoodsRequest;
import com.harkins.startYourEngine.dto.response.GoodsResponse;
import com.harkins.startYourEngine.entity.Goods;

@Mapper(componentModel = "spring")
public interface GoodsMapper {
    Goods toGoods(CreateGoodsRequest request);

    GoodsResponse toGoodsResponse(Goods goods);

    @Mapping(target = "goodsName", ignore = true)
    @Mapping(target = "goodsCategory", ignore = true)
    void updateGoods(@MappingTarget Goods goods, UpdateGoodsRequest request);
}
