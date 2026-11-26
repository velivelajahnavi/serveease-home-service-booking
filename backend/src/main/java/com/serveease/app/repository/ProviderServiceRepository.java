package com.serveease.app.repository;

import com.serveease.app.entity.ProviderService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProviderServiceRepository extends JpaRepository<ProviderService, Long> {
    List<ProviderService> findByProviderId(Long providerId);
    List<ProviderService> findByServiceItemId(Long serviceItemId);
    boolean existsByProviderIdAndServiceItemId(Long providerId, Long serviceItemId);
    Optional<ProviderService> findByProviderIdAndServiceItemId(Long providerId, Long serviceItemId);
}