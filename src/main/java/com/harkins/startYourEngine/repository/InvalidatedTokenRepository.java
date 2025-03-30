package com.harkins.startYourEngine.repository;

import com.harkins.startYourEngine.entity.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, String> {

}
