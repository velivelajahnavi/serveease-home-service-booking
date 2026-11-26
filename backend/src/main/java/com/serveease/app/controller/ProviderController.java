package com.serveease.app.controller;

import com.serveease.app.dto.BookingDtos.*;
import com.serveease.app.dto.ServiceDtos.ServiceResponse;
import com.serveease.app.dto.UserDtos.ProfileResponse;
import com.serveease.app.service.BookingService;
import com.serveease.app.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provider")
public class ProviderController {

    public record AvailabilityRequest(boolean available) {}

    private final BookingService bookingService;
    private final ProfileService profileService;

    public ProviderController(BookingService bookingService, ProfileService profileService) {
        this.bookingService = bookingService;
        this.profileService = profileService;
    }

    @GetMapping("/stats")
    public ProviderStatsResponse getStats(Authentication authentication) {
        return bookingService.getProviderStats(authentication.getName());
    }

    @GetMapping("/services")
    public List<ServiceResponse> getAssignedServices(Authentication authentication) {
        return bookingService.getProviderAssignedServices(authentication.getName());
    }

    @GetMapping("/bookings")
    public List<BookingResponse> getAssignedBookings(Authentication authentication) {
        return bookingService.getProviderBookings(authentication.getName());
    }

    @PatchMapping("/bookings/{bookingId}/status")
    public BookingResponse updateBookingStatus(Authentication authentication,
                                               @PathVariable Long bookingId,
                                               @Valid @RequestBody UpdateBookingStatusRequest request) {
        return bookingService.updateBookingStatusByProvider(
                authentication.getName(), bookingId, request.status());
    }

    @PatchMapping("/availability")
    public ProfileResponse updateAvailability(Authentication authentication,
                                              @RequestBody AvailabilityRequest request) {
        return profileService.toggleProviderAvailability(authentication.getName(), request.available());
    }
}