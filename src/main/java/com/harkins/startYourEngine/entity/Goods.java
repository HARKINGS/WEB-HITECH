package com.harkins.startYourEngine.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Goods {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long goodsId;

    private String goodsName;
    private String goodsVersion;
    private Long quantity;
    private Double price;
    private String goodsDescription;
    private String goodsCategory;
    private String goodsBrand;
    private String goodsImageURL;
    // private String goodsStatus;

//    @OneToMany(mappedBy = "goods", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Review> reviews;
}
