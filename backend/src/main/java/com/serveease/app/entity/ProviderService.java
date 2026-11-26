package com.serveease.app.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "provider_services",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_provider_service", columnNames = {"provider_id", "service_id"})
        }
)
public class ProviderService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private ProviderProfile provider;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceItem serviceItem;

    @Column(name = "assigned_at", nullable = false, updatable = false)
    private LocalDateTime assignedAt = LocalDateTime.now();

    public ProviderService() {}

    public ProviderService(ProviderProfile provider, ServiceItem serviceItem) {
        this.provider = provider;
        this.serviceItem = serviceItem;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProviderProfile getProvider() { return provider; }
    public void setProvider(ProviderProfile provider) { this.provider = provider; }

    public ServiceItem getServiceItem() { return serviceItem; }
    public void setServiceItem(ServiceItem serviceItem) { this.serviceItem = serviceItem; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
}