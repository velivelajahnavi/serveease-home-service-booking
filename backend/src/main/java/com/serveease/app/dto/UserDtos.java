package com.serveease.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class UserDtos {

    public record CustomerResponse(
            Long userId,
            Long profileId,
            String fullName,
            String email,
            String status,
            String phone,
            String address,
            String city
    ) {}

    public record CustomerRequest(
            @NotBlank(message = "Full name is required") String fullName,
            @NotBlank(message = "Email is required") @Email String email,
            String password,
            String phone,
            String address,
            String city
    ) {}

    public record ProviderResponse(
            Long userId,
            Long profileId,
            String fullName,
            String email,
            String status,
            String employeeCode,
            String phone,
            String specialization,
            Integer experienceYears,
            BigDecimal hourlyRate,
            boolean available
    ) {}

    public record ProviderRequest(
            @NotBlank(message = "Full name is required") String fullName,
            @NotBlank(message = "Email is required") @Email String email,
            String password,
            String employeeCode,
            String phone,
            String specialization,
            Integer experienceYears,
            BigDecimal hourlyRate,
            Boolean available
    ) {}

    public record ProfileResponse(
            Long userId,
            String fullName,
            String email,
            String role,
            String status,
            String authProvider,
            String phone,
            String address,
            String city,
            String employeeCode,
            String specialization,
            Integer experienceYears,
            BigDecimal hourlyRate,
            Boolean available
    ) {}

    public record ProfileUpdateRequest(
            @NotBlank(message = "Full name is required") String fullName,
            String phone,
            String address,
            String city,
            String specialization,
            Integer experienceYears,
            BigDecimal hourlyRate,
            Boolean available
    ) {}

    public record StatusUpdateRequest(
            @NotBlank(message = "Status is required") String status
    ) {}
}