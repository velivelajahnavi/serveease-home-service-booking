package com.serveease.app.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "services")
public class ServiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "service_name", nullable = false, length = 120)
    private String serviceName;

    @Column(name = "service_code", nullable = false, unique = true, length = 30)
    private String serviceCode;

    @Column(nullable = false, length = 80)
    private String category;

    @Column(length = 500)
    private String description;

    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "duration_mins", nullable = false)
    private Integer durationMins = 60;

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "serviceItem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProviderService> providerServices = new ArrayList<>();

    public ServiceItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getServiceCode() { return serviceCode; }
    public void setServiceCode(String serviceCode) { this.serviceCode = serviceCode; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public Integer getDurationMins() { return durationMins; }
    public void setDurationMins(Integer durationMins) { this.durationMins = durationMins; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public List<ProviderService> getProviderServices() { return providerServices; }
    public void setProviderServices(List<ProviderService> providerServices) { this.providerServices = providerServices; }
}