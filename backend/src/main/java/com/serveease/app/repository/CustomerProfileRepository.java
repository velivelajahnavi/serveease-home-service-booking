package com.serveease.app.repository;

import com.serveease.app.entity.CustomerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, Long> {
    Optional<CustomerProfile> findByUserId(Long userId);
    Optional<CustomerProfile> findByUserEmail(String email);
}