package com.harkins.startYourEngine.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.harkins.startYourEngine.dto.request.CreateGoodsRequest;
import com.harkins.startYourEngine.dto.request.UpdateGoodsRequest;
import com.harkins.startYourEngine.dto.response.ApiResponse;
import com.harkins.startYourEngine.dto.response.GoodsDetailsResponse;
import com.harkins.startYourEngine.dto.response.GoodsResponse;
import com.harkins.startYourEngine.dto.response.GoodsReviewResponse;
import com.harkins.startYourEngine.service.GoodsReviewService;
import com.harkins.startYourEngine.service.GoodsService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@RequestMapping("/goods")
public class GoodsController {

    GoodsService goodsService;
    GoodsReviewService goodsReviewService;

    @GetMapping("/details/{goodsId}")
    public ResponseEntity<?> getGoodsWithReviews(@PathVariable("goodsId") String goodsId) {
        try {
            // Lấy thông tin sản phẩm
            GoodsResponse goods = goodsService.getGoodsById(goodsId);

            // Lấy danh sách đánh giá
            List<GoodsReviewResponse> reviews = goodsReviewService.getReviewByGoods(goodsId);

            // Tạo đối tượng chứa cả sản phẩm và đánh giá
            GoodsDetailsResponse response = new GoodsDetailsResponse(goods, reviews);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve goods details: " + e.getMessage());
        }
    }

    @PostMapping()
    public ApiResponse<GoodsResponse> createGoods(
            @RequestParam("goodsName") String goodsName,
            @RequestParam("goodsVersion") String goodsVersion,
            @RequestParam("goodsDescription") String goodsDescription,
            @RequestParam("price") Long price,
            @RequestParam("quantity") Long quantity,
            @RequestParam("goodsCategory") String goodsCategory,
            @RequestParam("goodsBrand") String goodsBrand,
            @RequestParam("imageFile") MultipartFile imageFile) {

        CreateGoodsRequest request = CreateGoodsRequest.builder()
                .goodsName(goodsName)
                .goodsVersion(goodsVersion)
                .goodsDescription(goodsDescription)
                .price(price)
                .quantity(quantity)
                .goodsCategory(goodsCategory)
                .goodsBrand(goodsBrand)
                .build();

        return ApiResponse.<GoodsResponse>builder()
                .result(goodsService.createGoods(request, imageFile))
                .build();
    }

    @GetMapping("/all-goods")
    ApiResponse<List<GoodsResponse>> getGoods() {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoods())
                .build();
    }

    @GetMapping("/by-id/{goodsId}")
    ApiResponse<GoodsResponse> getGoodsById(@PathVariable("goodsId") String goodsId) {
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

    @GetMapping("/by-brand/{goodsBrand}")
    ApiResponse<List<GoodsResponse>> getGoodsByBrand(@PathVariable("goodsBrand") String goodsBrand) {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoodsByBrand(goodsBrand))
                .build();
    }

    @GetMapping("/by-price/{goodsPrice}")
    ApiResponse<List<GoodsResponse>> getGoodsByPrice(@PathVariable("goodsPrice") Long price) {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoodsByPrice(price))
                .build();
    }

    @GetMapping("/{minPrice}_{maxPrice}")
    ApiResponse<List<GoodsResponse>> getGoodsByPrice(
            @PathVariable("minPrice") Long minPrice, @PathVariable("maxPrice") Long maxPrice) {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoodsByPriceRange(minPrice, maxPrice))
                .build();
    }

    @GetMapping("/by-rating")
    public ApiResponse<List<GoodsResponse>> getGoodsByRating(@RequestParam("min") int minRating) {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoodsByMinRating(minRating))
                .build();
    }

    @GetMapping("/sort-name-asc")
    public ApiResponse<List<GoodsResponse>> sortByNameAsc() {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoodsSortedByNameAsc())
                .build();
    }

    @GetMapping("/sort-name-desc")
    public ApiResponse<List<GoodsResponse>> sortByNameDesc() {
        return ApiResponse.<List<GoodsResponse>>builder()
                .result(goodsService.getGoodsSortedByNameDesc())
                .build();
    }

    @PutMapping("/{goodsId}")
    ApiResponse<GoodsResponse> updateGoods(
            @PathVariable("goodsId") String goodsId,
            @Valid @RequestBody UpdateGoodsRequest request,
            @RequestParam("imageFile") MultipartFile imageFile) {
        return ApiResponse.<GoodsResponse>builder()
                .result(goodsService.updateGoods(goodsId, request, imageFile))
                .build();
    }

    @DeleteMapping("/{goodsId}")
    ApiResponse<String> deleteGoods(@PathVariable("goodsId") String goodsId) {
        goodsService.deleteGoods(goodsId);
        return ApiResponse.<String>builder().result("Goods deleted").build();
    }

    @GetMapping("/{goodsId}/reviews")
    public ApiResponse<List<GoodsReviewResponse>> getGoodsReviews(@PathVariable("goodsId") String goodsId) {
        return ApiResponse.<List<GoodsReviewResponse>>builder()
                .result(goodsReviewService.getReviewByGoods(goodsId))
                .build();
    }
}
