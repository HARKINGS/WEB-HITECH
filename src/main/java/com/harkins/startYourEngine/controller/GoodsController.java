package com.harkins.startYourEngine.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.harkins.startYourEngine.dto.request.CreateGoodsRequest;
import com.harkins.startYourEngine.dto.request.UpdateGoodsRequest;
import com.harkins.startYourEngine.dto.response.ApiResponse;
import com.harkins.startYourEngine.dto.response.GoodsResponse;
import com.harkins.startYourEngine.service.GoodsService;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Builder
@RequestMapping("/goods")
public class GoodsController {

    GoodsService goodsService;

    @PostMapping
    ApiResponse<GoodsResponse> createGoods(@Valid @RequestBody CreateGoodsRequest request) {
        return ApiResponse.<GoodsResponse>builder()
                .result(goodsService.createGoods(request))
                .build();
    }

    @GetMapping("/all-goods")
    ApiResponse<List<GoodsResponse>> getGoods() {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoods())
                .build();
    }

    @GetMapping("/{goodsId}")
    ApiResponse<GoodsResponse> getGoodsById(@PathVariable("goodsId") Long goodsId) {
        return ApiResponse.<GoodsResponse>builder()
                .result(goodsService.getGoodsById(goodsId))
                .build();
    }

    @GetMapping("/goodsName")
    ApiResponse<List<GoodsResponse>> getGoodsByName(@RequestParam("goodsName") String goodsName) {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoodsByName(goodsName))
                .build();
    }

    @GetMapping("/goodsCategory")
    ApiResponse<List<GoodsResponse>> getGoodsByCategory(@RequestParam("goodsCategory") String goodsCategory) {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoodsByCategory(goodsCategory))
                .build();
    }

    @PutMapping("/update")
    ApiResponse<GoodsResponse> updateGoods(
            @RequestParam("goodsId") Long goodsId, @Valid @RequestBody UpdateGoodsRequest request) {
        return ApiResponse.<GoodsResponse>builder()
                .result(goodsService.updateGoods(goodsId, request))
                .build();
    }

    @DeleteMapping("/{goodsId}")
    ApiResponse<String> deleteGoods(@PathVariable("goodsId") Long goodsId) {
        goodsService.deleteGoods(goodsId);
        return ApiResponse.<String>builder().result("Goods deleted").build();
    }
}
