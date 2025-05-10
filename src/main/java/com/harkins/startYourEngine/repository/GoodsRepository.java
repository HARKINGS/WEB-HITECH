package com.harkins.startYourEngine.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.harkins.startYourEngine.entity.Goods;

@Repository
public interface GoodsRepository extends JpaRepository<Goods, String> {

    boolean existsByGoodsName(String goodsName);

    List<Goods> findByGoodsNameContainingIgnoreCase(String goodsName);

    List<Goods> findByGoodsCategory(String goodsCategory);
}
