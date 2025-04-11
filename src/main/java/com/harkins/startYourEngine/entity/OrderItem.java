package com.harkins.startYourEngine.entity;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "infoBuyId")
    private InfoBuy infoBuy;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "goodsId")
    private Goods goods;

    private Integer quantity;
}
