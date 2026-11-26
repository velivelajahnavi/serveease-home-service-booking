package com.serveease.app.controller;

import com.serveease.app.dto.AuthDtos.MessageResponse;
import com.serveease.app.dto.BookingDtos.AdminReportResponse;
import com.serveease.app.dto.BookingDtos.BookingResponse;
import com.serveease.app.dto.ServiceDtos.*;
import com.serveease.app.dto.UserDtos.*;
import com.serveease.app.service.AdminService;
import com.serveease.app.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final BookingService bookingService;

    public AdminController(AdminService adminService, BookingService bookingService) {
        this.adminService = adminService;
        this.bookingService = bookingService;
    }

    @GetMapping("/reports")
    public AdminReportResponse getReports() {
        return adminService.getAdminReport();
    }

    @GetMapping("/customers")
    public List<CustomerResponse> getCustomers() {
        return adminService.getAllCustomers();
    }

    @PostMapping("/customers")
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerResponse createCustomer(@Valid @RequestBody CustomerRequest request) {
        return adminService.createCustomer(request);
    }

    @PutMapping("/customers/{userId}")
    public CustomerResponse updateCustomer(@PathVariable Long userId,
                                           @Valid @RequestBody CustomerRequest request) {
        return adminService.updateCustomer(userId, request);
    }

    @GetMapping("/providers")
    public List<ProviderResponse> getProviders() {
        return adminService.getAllProviders();
    }

    @PostMapping("/providers")
    @ResponseStatus(HttpStatus.CREATED)
    public ProviderResponse createProvider(@Valid @RequestBody ProviderRequest request) {
        return adminService.createProvider(request);
    }

    @PutMapping("/providers/{userId}")
    public ProviderResponse updateProvider(@PathVariable Long userId,
                                           @Valid @RequestBody ProviderRequest request) {
        return adminService.updateProvider(userId, request);
    }

    @PatchMapping("/users/{userId}/status")
    public MessageResponse updateUserStatus(@PathVariable Long userId,
                                            @Valid @RequestBody StatusUpdateRequest request) {
        adminService.updateUserStatus(userId, request.status());
        return new MessageResponse("User status updated to " + request.status().toUpperCase());
    }

    @GetMapping("/services")
    public List<ServiceResponse> getServices() {
        return adminService.getAllServices();
    }

    @PostMapping("/services")
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceResponse createService(@Valid @RequestBody ServiceRequest request) {
        return adminService.createService(request);
    }

    @PutMapping("/services/{serviceId}")
    public ServiceResponse updateService(@PathVariable Long serviceId,
                                         @Valid @RequestBody ServiceRequest request) {
        return adminService.updateService(serviceId, request);
    }

    @PostMapping("/services/assign")
    public ServiceResponse assignProvider(@Valid @RequestBody AssignProviderRequest request) {
        return adminService.assignProviderToService(request);
    }

    @DeleteMapping("/services/{serviceId}/providers/{providerProfileId}")
    public ServiceResponse unassignProvider(@PathVariable Long serviceId,
                                            @PathVariable Long providerProfileId) {
        return adminService.unassignProviderFromService(providerProfileId, serviceId);
    }

    @GetMapping("/bookings")
    public List<BookingResponse> getAllBookings() {
        return bookingService.getAllBookingsForAdmin();
    }
}