package com.serveease.app.repository;

import com.serveease.app.entity.Booking;
import com.serveease.app.entity.BookingStatus;
import com.serveease.app.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerIdOrderByBookingDateDescCreatedAtDesc(Long customerId);
    List<Booking> findByProviderIdOrderByBookingDateDescCreatedAtDesc(Long providerId);
    List<Booking> findAllByOrderByBookingDateDescCreatedAtDesc();

    boolean existsByProviderIdAndBookingDateAndTimeSlotAndStatusNot(
            Long providerId, LocalDate bookingDate, TimeSlot timeSlot, BookingStatus status);

    boolean existsByCustomerIdAndServiceItemIdAndBookingDateAndTimeSlotAndStatusNot(
            Long customerId, Long serviceItemId, LocalDate bookingDate, TimeSlot timeSlot, BookingStatus status);

    long countByStatus(BookingStatus status);
    long countByCustomerId(Long customerId);
    long countByCustomerIdAndStatus(Long customerId, BookingStatus status);
    long countByProviderId(Long providerId);
    long countByProviderIdAndStatus(Long providerId, BookingStatus status);

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Booking b WHERE b.status = com.serveease.app.entity.BookingStatus.COMPLETED")
    BigDecimal getTotalCompletedRevenue();

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Booking b WHERE b.provider.id = :providerId AND b.status = com.serveease.app.entity.BookingStatus.COMPLETED")
    BigDecimal getProviderCompletedRevenue(@Param("providerId") Long providerId);
}