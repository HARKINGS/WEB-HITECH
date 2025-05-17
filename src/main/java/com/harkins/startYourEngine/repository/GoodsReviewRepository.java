package com.harkins.startYourEngine.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.harkins.startYourEngine.entity.Goods;
import com.harkins.startYourEngine.entity.GoodsReview;

@Repository
public interface GoodsReviewRepository extends JpaRepository<GoodsReview, String> {
    List<GoodsReview> findByGoods_GoodsId(String goodsId);

    boolean existsByGoodsAndUserName(Goods goods, String userName);

    List<Goods> findGoodsByRating(double rating);
}
