package com.harkins.startYourEngine.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Goods {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String goodsId;

    String goodsName;
    String goodsVersion;
    Long quantity;
    Double price;
    String goodsDescription;
    String goodsCategory;
    String goodsImageURL;

    @JsonManagedReference(value = "goods-orderItems")
    @OneToMany(mappedBy = "goods", cascade = CascadeType.ALL)
    List<OrderItem> orderItems;

    @OneToMany(mappedBy = "goods", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("goods-reviews")
    List<GoodsReview> goodsReviews;
}
