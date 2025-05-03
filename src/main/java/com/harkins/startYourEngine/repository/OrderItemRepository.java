package com.harkins.startYourEngine.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.harkins.startYourEngine.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {}
