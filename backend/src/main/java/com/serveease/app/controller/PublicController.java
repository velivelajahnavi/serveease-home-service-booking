package com.serveease.app.controller;

import com.serveease.app.dto.ServiceDtos.ServiceResponse;
import com.serveease.app.entity.TimeSlot;
import com.serveease.app.service.BookingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    public record TimeSlotOption(String code, String label, int startHour) {}
    public record HealthStatus(String status, String app) {}

    private final BookingService bookingService;

    public PublicController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/health")
    public HealthStatus health() {
        return new HealthStatus("UP", "ServeEase Home Service Booking API");
    }

    @GetMapping("/services")
    public List<ServiceResponse> getPublicServices() {
        return bookingService.getActiveServicesForCatalog();
    }

    @GetMapping("/time-slots")
    public List<TimeSlotOption> getTimeSlots() {
        return Arrays.stream(TimeSlot.values())
                .map(slot -> new TimeSlotOption(slot.name(), slot.getLabel(), slot.getStartTime().getHour()))
                .toList();
    }
}