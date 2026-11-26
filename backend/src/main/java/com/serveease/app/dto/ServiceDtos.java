package com.serveease.app.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public class ServiceDtos {

    public record ServiceRequest(
            @NotBlank(message = "Service name is required") String serviceName,
            @NotBlank(message = "Service code is required") String serviceCode,
            @NotBlank(message = "Category is required") String category,
            String description,
            @NotNull(message = "Base price is required") @DecimalMin("1.0") BigDecimal basePrice,
            @NotNull(message = "Duration is required") @Min(15) Integer durationMins,
            Boolean active
    ) {}

    public record ProviderBrief(
            Long providerProfileId,
            String fullName,
            String employeeCode,
            String specialization,
            Integer experienceYears,
            BigDecimal hourlyRate,
            boolean available
    ) {}

    public record ServiceResponse(
            Long id,
            String serviceName,
            String serviceCode,
            String category,
            String description,
            BigDecimal basePrice,
            Integer durationMins,
            boolean active,
            List<ProviderBrief> assignedProviders
    ) {}

    public record AssignProviderRequest(
            @NotNull(message = "Provider profile ID is required") Long providerProfileId,
            @NotNull(message = "Service ID is required") Long serviceId
    ) {}
}