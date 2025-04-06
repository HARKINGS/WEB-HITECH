package com.harkins.startYourEngine.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.harkins.startYourEngine.entity.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

}
