package com.harkins.startYourEngine.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.harkins.startYourEngine.entity.Goods;

@Repository
public interface GoodsRepository extends JpaRepository<Goods, String> {

    boolean existsByGoodsName(String goodsName);

    List<Goods> findByGoodsNameContainingIgnoreCase(String goodsName);

    List<Goods> findByGoodsCategory(String goodsCategory);

    List<Goods> findByGoodsBrand(String goodsBrand);

    List<Goods> findByPrice(Long price);

    List<Goods> findByPriceBetween(Long minPrice, Long maxPrice);

    @Query("""
		SELECT g FROM Goods g
		JOIN g.goodsReviews r
		GROUP BY g
		HAVING AVG(r.rating) >= :minRating
	""")
    List<Goods> findByAverageRatingGreaterThanEqual(@Param("minRating") int minRating);

    List<Goods> findAllByOrderByGoodsNameAsc();

    List<Goods> findAllByOrderByGoodsNameDesc();
}
