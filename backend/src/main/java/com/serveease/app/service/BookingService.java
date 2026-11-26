package com.serveease.app.service;

import com.serveease.app.dto.BookingDtos.*;
import com.serveease.app.dto.ServiceDtos.ServiceResponse;
import com.serveease.app.entity.*;
import com.serveease.app.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import java.time.LocalTime;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final ProviderServiceRepository providerServiceRepository;
    private final AdminService adminService;

    public BookingService(BookingRepository bookingRepository,
                          CustomerProfileRepository customerProfileRepository,
                          ProviderProfileRepository providerProfileRepository,
                          ServiceItemRepository serviceItemRepository,
                          ProviderServiceRepository providerServiceRepository,
                          AdminService adminService) {
        this.bookingRepository = bookingRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.serviceItemRepository = serviceItemRepository;
        this.providerServiceRepository = providerServiceRepository;
        this.adminService = adminService;
    }

    @Transactional(readOnly = true)
    public List<ServiceResponse> getActiveServicesForCatalog() {
        return serviceItemRepository.findByActiveTrue().stream()
                .map(adminService::toServiceResponse)
                .toList();
    }

    @Transactional
    public BookingResponse createBooking(String customerEmail, CreateBookingRequest request) {
        // Rule 1: Sunday is automatically a holiday
        if (request.bookingDate().getDayOfWeek() == DayOfWeek.SUNDAY) {
            throw new IllegalArgumentException("Bookings cannot be scheduled on Sundays (weekly holiday).");
        }

        // Rule 2: Cannot book on past dates
        if (request.bookingDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Booking date cannot be in the past.");
        }

        TimeSlot slot;
        try {
            slot = TimeSlot.valueOf(request.timeSlot().trim().toUpperCase());
        }
        catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid time slot selected.");
        }
        // Rule 2b: Cannot book a time slot that has already started/passed today
        if (request.bookingDate().isEqual(LocalDate.now())
                && !slot.getStartTime().isAfter(LocalTime.now())) {
            throw new IllegalArgumentException(
                    "Selected time slot has already passed for today. Please choose a later slot or future date.");
        }

        CustomerProfile customer = customerProfileRepository.findByUserEmail(customerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Customer profile not found."));

        ServiceItem serviceItem = serviceItemRepository.findById(request.serviceId())
                .orElseThrow(() -> new IllegalArgumentException("Service not found."));
        if (!serviceItem.isActive()) {
            throw new IllegalArgumentException("Selected service is currently unavailable.");
        }

        ProviderProfile provider = providerProfileRepository.findById(request.providerProfileId())
                .orElseThrow(() -> new IllegalArgumentException("Service provider not found."));
        if (provider.getUser().getStatus() != UserStatus.ACTIVE || !provider.isAvailable()) {
            throw new IllegalArgumentException("Selected provider is currently unavailable.");
        }

        // Rule 3: Provider must be explicitly assigned to this service
        boolean isAssigned = providerServiceRepository.existsByProviderIdAndServiceItemId(
                provider.getId(), serviceItem.getId());
        if (!isAssigned) {
            throw new IllegalArgumentException("Selected provider is not assigned to this service.");
        }

        // Rule 4: One active booking per provider, date, and time slot
        boolean providerBusy = bookingRepository.existsByProviderIdAndBookingDateAndTimeSlotAndStatusNot(
                provider.getId(), request.bookingDate(), slot, BookingStatus.CANCELLED);
        if (providerBusy) {
            throw new IllegalStateException("This provider is already booked for the selected date and time slot.");
        }

        // Rule 5: No duplicate customer booking for the same service, date, and slot
        boolean duplicateCustomerBooking = bookingRepository
                .existsByCustomerIdAndServiceItemIdAndBookingDateAndTimeSlotAndStatusNot(
                        customer.getId(), serviceItem.getId(), request.bookingDate(), slot, BookingStatus.CANCELLED);
        if (duplicateCustomerBooking) {
            throw new IllegalStateException("You already have a booking for this service at the same date and slot.");
        }

        Booking booking = new Booking();
        booking.setBookingCode("BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setCustomer(customer);
        booking.setProvider(provider);
        booking.setServiceItem(serviceItem);
        booking.setBookingDate(request.bookingDate());
        booking.setTimeSlot(slot);
        booking.setStatus(BookingStatus.PENDING);
        booking.setServiceAddress(request.serviceAddress().trim());
        booking.setNotes(request.notes());
        booking.setTotalPrice(serviceItem.getBasePrice());

        booking = bookingRepository.save(booking);
        return toBookingResponse(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getCustomerBookings(String customerEmail) {
        CustomerProfile customer = customerProfileRepository.findByUserEmail(customerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Customer profile not found."));
        return bookingRepository.findByCustomerIdOrderByBookingDateDescCreatedAtDesc(customer.getId())
                .stream()
                .map(this::toBookingResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CustomerStatsResponse getCustomerStats(String customerEmail) {
        CustomerProfile customer = customerProfileRepository.findByUserEmail(customerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Customer profile not found."));
        Long id = customer.getId();
        return new CustomerStatsResponse(
                bookingRepository.countByCustomerId(id),
                bookingRepository.countByCustomerIdAndStatus(id, BookingStatus.PENDING),
                bookingRepository.countByCustomerIdAndStatus(id, BookingStatus.CONFIRMED),
                bookingRepository.countByCustomerIdAndStatus(id, BookingStatus.COMPLETED),
                bookingRepository.countByCustomerIdAndStatus(id, BookingStatus.CANCELLED)
        );
    }

    @Transactional
    public BookingResponse cancelCustomerBooking(String customerEmail, Long bookingId) {
        CustomerProfile customer = customerProfileRepository.findByUserEmail(customerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Customer profile not found."));
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));

        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new IllegalArgumentException("You can only cancel your own bookings.");
        }
        if (booking.getStatus() == BookingStatus.COMPLETED || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Cannot cancel a booking that is already " + booking.getStatus() + ".");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return toBookingResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<ServiceResponse> getProviderAssignedServices(String providerEmail) {
        ProviderProfile provider = providerProfileRepository.findByUserEmail(providerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Provider profile not found."));
        return providerServiceRepository.findByProviderId(provider.getId()).stream()
                .map(ps -> adminService.toServiceResponse(ps.getServiceItem()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getProviderBookings(String providerEmail) {
        ProviderProfile provider = providerProfileRepository.findByUserEmail(providerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Provider profile not found."));
        return bookingRepository.findByProviderIdOrderByBookingDateDescCreatedAtDesc(provider.getId())
                .stream()
                .map(this::toBookingResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProviderStatsResponse getProviderStats(String providerEmail) {
        ProviderProfile provider = providerProfileRepository.findByUserEmail(providerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Provider profile not found."));
        Long id = provider.getId();
        return new ProviderStatsResponse(
                provider.isAvailable(),
                providerServiceRepository.findByProviderId(id).size(),
                bookingRepository.countByProviderId(id),
                bookingRepository.countByProviderIdAndStatus(id, BookingStatus.PENDING),
                bookingRepository.countByProviderIdAndStatus(id, BookingStatus.CONFIRMED),
                bookingRepository.countByProviderIdAndStatus(id, BookingStatus.IN_PROGRESS),
                bookingRepository.countByProviderIdAndStatus(id, BookingStatus.COMPLETED),
                bookingRepository.getProviderCompletedRevenue(id)
        );
    }

    @Transactional
    public BookingResponse updateBookingStatusByProvider(String providerEmail, Long bookingId, String statusStr) {
        ProviderProfile provider = providerProfileRepository.findByUserEmail(providerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Provider profile not found."));
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));

        if (!booking.getProvider().getId().equals(provider.getId())) {
            throw new IllegalArgumentException("You can only update bookings assigned to you.");
        }

        BookingStatus newStatus;
        try {
            newStatus = BookingStatus.valueOf(statusStr.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid booking status.");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.COMPLETED) {
            throw new IllegalStateException("Cannot modify a booking that is already " + booking.getStatus() + ".");
        }

        booking.setStatus(newStatus);
        return toBookingResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookingsForAdmin() {
        return bookingRepository.findAllByOrderByBookingDateDescCreatedAtDesc().stream()
                .map(this::toBookingResponse)
                .toList();
    }

    private BookingResponse toBookingResponse(Booking b) {
        return new BookingResponse(
                b.getId(),
                b.getBookingCode(),
                b.getServiceItem().getId(),
                b.getServiceItem().getServiceName(),
                b.getServiceItem().getServiceCode(),
                b.getServiceItem().getCategory(),
                b.getCustomer().getId(),
                b.getCustomer().getUser().getFullName(),
                b.getCustomer().getUser().getEmail(),
                b.getCustomer().getPhone(),
                b.getProvider().getId(),
                b.getProvider().getUser().getFullName(),
                b.getProvider().getEmployeeCode(),
                b.getProvider().getPhone(),
                b.getBookingDate(),
                b.getTimeSlot().name(),
                b.getTimeSlot().getLabel(),
                b.getStatus().name(),
                b.getServiceAddress(),
                b.getNotes(),
                b.getTotalPrice(),
                b.getCreatedAt().toString()
        );
    }
}