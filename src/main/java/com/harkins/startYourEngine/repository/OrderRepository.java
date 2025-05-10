package com.harkins.startYourEngine.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.harkins.startYourEngine.entity.Order;
import com.harkins.startYourEngine.enums.OrderStatus;

public interface OrderRepository extends JpaRepository<Order, String> {

    Optional<Order> findByTransactionId(String transactionId);

    List<Order> findByStatus(String status);

    List<Order> findByStatus(OrderStatus orderStatus);

    List<Order> findByUser_UserId(String userId);
}
