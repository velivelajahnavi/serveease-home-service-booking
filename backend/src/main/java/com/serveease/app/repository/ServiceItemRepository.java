package com.serveease.app.repository;

import com.serveease.app.entity.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {
    Optional<ServiceItem> findByServiceCode(String serviceCode);
    boolean existsByServiceCode(String serviceCode);
    List<ServiceItem> findByActiveTrue();
}