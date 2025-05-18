package com.harkins.startYourEngine.entity;

import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;

import com.harkins.startYourEngine.enums.OrderStatus;
import com.harkins.startYourEngine.enums.PaymentStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "orders")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<OrderItem> orderItems;

    @ManyToOne
    @JoinColumn(name = "voucherId")
    Voucher voucher;

    String shippingAddress;

    @Enumerated(EnumType.STRING)
    OrderStatus status = OrderStatus.PENDING;

    @Enumerated(EnumType.STRING)
    PaymentStatus paymentStatus = PaymentStatus.PENDING;

    String paymentMethod;

    @Positive
    Long totalPrice;

    @Positive
    Double finalPrice;

    @Column(nullable = true)
    String transactionId;

    String username;
}
