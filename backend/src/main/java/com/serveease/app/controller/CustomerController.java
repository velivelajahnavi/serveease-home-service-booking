package com.serveease.app.controller;

import com.serveease.app.dto.BookingDtos.*;
import com.serveease.app.dto.ServiceDtos.ServiceResponse;
import com.serveease.app.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    private final BookingService bookingService;

    public CustomerController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/stats")
    public CustomerStatsResponse getStats(Authentication authentication) {
        return bookingService.getCustomerStats(authentication.getName());
    }

    @GetMapping("/services")
    public List<ServiceResponse> getAvailableServices() {
        return bookingService.getActiveServicesForCatalog();
    }

    @GetMapping("/bookings")
    public List<BookingResponse> getMyBookings(Authentication authentication) {
        return bookingService.getCustomerBookings(authentication.getName());
    }

    @PostMapping("/bookings")
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse createBooking(Authentication authentication,
                                         @Valid @RequestBody CreateBookingRequest request) {
        return bookingService.createBooking(authentication.getName(), request);
    }

    @PatchMapping("/bookings/{bookingId}/cancel")
    public BookingResponse cancelBooking(Authentication authentication,
                                         @PathVariable Long bookingId) {
        return bookingService.cancelCustomerBooking(authentication.getName(), bookingId);
    }
}