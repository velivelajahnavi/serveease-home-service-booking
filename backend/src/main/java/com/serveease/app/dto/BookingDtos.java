package com.serveease.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class BookingDtos {

    public record CreateBookingRequest(
            @NotNull(message = "Service ID is required") Long serviceId,
            @NotNull(message = "Provider ID is required") Long providerProfileId,
            @NotNull(message = "Booking date is required") LocalDate bookingDate,
            @NotBlank(message = "Time slot is required") String timeSlot,
            @NotBlank(message = "Service address is required") String serviceAddress,
            String notes
    ) {}

    public record UpdateBookingStatusRequest(
            @NotBlank(message = "Status is required") String status
    ) {}

    public record BookingResponse(
            Long id,
            String bookingCode,
            Long serviceId,
            String serviceName,
            String serviceCode,
            String category,
            Long customerProfileId,
            String customerName,
            String customerEmail,
            String customerPhone,
            Long providerProfileId,
            String providerName,
            String providerCode,
            String providerPhone,
            LocalDate bookingDate,
            String timeSlot,
            String timeSlotLabel,
            String status,
            String serviceAddress,
            String notes,
            BigDecimal totalPrice,
            String createdAt
    ) {}

    public record AdminReportResponse(
            long totalCustomers,
            long activeCustomers,
            long totalProviders,
            long activeProviders,
            long totalServices,
            long activeServices,
            long totalBookings,
            long pendingBookings,
            long confirmedBookings,
            long inProgressBookings,
            long completedBookings,
            long cancelledBookings,
            BigDecimal totalCompletedRevenue
    ) {}

    public record CustomerStatsResponse(
            long totalBookings,
            long pendingBookings,
            long confirmedBookings,
            long completedBookings,
            long cancelledBookings
    ) {}

    public record ProviderStatsResponse(
            boolean available,
            long assignedServicesCount,
            long totalBookings,
            long pendingBookings,
            long confirmedBookings,
            long inProgressBookings,
            long completedBookings,
            BigDecimal totalCompletedRevenue
    ) {}
}