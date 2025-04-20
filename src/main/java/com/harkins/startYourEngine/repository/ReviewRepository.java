package com.harkins.startYourEngine.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.harkins.startYourEngine.entity.Goods;
import com.harkins.startYourEngine.entity.Review;
import com.harkins.startYourEngine.entity.User;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByGoods_GoodsId(Long goodsId);

    boolean existsByGoodsAndUser(Goods goods, User user);
}
