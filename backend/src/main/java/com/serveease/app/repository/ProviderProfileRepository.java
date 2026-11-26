package com.serveease.app.repository;

import com.serveease.app.entity.ProviderProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, Long> {
    Optional<ProviderProfile> findByUserId(Long userId);
    Optional<ProviderProfile> findByUserEmail(String email);
    boolean existsByEmployeeCode(String employeeCode);
}