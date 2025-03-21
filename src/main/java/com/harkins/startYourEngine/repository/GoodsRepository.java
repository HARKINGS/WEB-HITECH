package com.harkins.startYourEngine.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.harkins.startYourEngine.entity.Goods;


@Repository
public interface GoodsRepository extends JpaRepository<Goods, Long> {

    boolean existsByGoodsName(String goodsName);

    List<Goods> findByGoodsNameContainingIgnoreCase(String goodsName);

    Optional<Goods> findByGoodsCategory(String goodsCategory);
}
