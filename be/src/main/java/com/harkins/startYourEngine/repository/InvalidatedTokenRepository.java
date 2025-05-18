package com.harkins.startYourEngine.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.harkins.startYourEngine.entity.InvalidatedToken;

public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, String> {}
