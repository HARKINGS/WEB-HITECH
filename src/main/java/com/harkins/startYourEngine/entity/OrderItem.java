package com.harkins.startYourEngine.entity;

import jakarta.persistence.*;

import com.harkins.startYourEngine.enums.OrderItemStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "orderId")
    Order order;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    OrderItemStatus status = OrderItemStatus.PENDING;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "goodsId")
    Goods goods;

    Integer quantity;
}
