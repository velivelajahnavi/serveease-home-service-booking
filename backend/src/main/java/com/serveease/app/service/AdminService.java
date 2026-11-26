package com.serveease.app.service;

import com.serveease.app.dto.BookingDtos.AdminReportResponse;
import com.serveease.app.dto.ServiceDtos.*;
import com.serveease.app.dto.UserDtos.*;
import com.serveease.app.entity.*;
import com.serveease.app.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final ProviderServiceRepository providerServiceRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository,
                        CustomerProfileRepository customerProfileRepository,
                        ProviderProfileRepository providerProfileRepository,
                        ServiceItemRepository serviceItemRepository,
                        ProviderServiceRepository providerServiceRepository,
                        BookingRepository bookingRepository,
                        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.serviceItemRepository = serviceItemRepository;
        this.providerServiceRepository = providerServiceRepository;
        this.bookingRepository = bookingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // --- Customers ---

    @Transactional(readOnly = true)
    public List<CustomerResponse> getAllCustomers() {
        return userRepository.findByRole(Role.CUSTOMER).stream()
                .map(this::toCustomerResponse)
                .toList();
    }

    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalStateException("Email already exists.");
        }
        String rawPassword = (request.password() == null || request.password().isBlank())
                ? "Customer@123"
                : request.password();

        User user = new User();
        user.setFullName(request.fullName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(Role.CUSTOMER);
        user.setStatus(UserStatus.ACTIVE);
        user.setAuthProvider(AuthProvider.LOCAL);
        user = userRepository.save(user);

        CustomerProfile cp = new CustomerProfile();
        cp.setUser(user);
        cp.setPhone(request.phone());
        cp.setAddress(request.address());
        cp.setCity(request.city());
        customerProfileRepository.save(cp);

        return toCustomerResponse(user);
    }

    @Transactional
    public CustomerResponse updateCustomer(Long userId, CustomerRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found."));
        if (user.getRole() != Role.CUSTOMER) {
            throw new IllegalArgumentException("Target user is not a customer.");
        }

        user.setFullName(request.fullName().trim());
        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }
        userRepository.save(user);

        CustomerProfile cp = customerProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    CustomerProfile created = new CustomerProfile();
                    created.setUser(user);
                    return created;
                });
        cp.setPhone(request.phone());
        cp.setAddress(request.address());
        cp.setCity(request.city());
        customerProfileRepository.save(cp);

        return toCustomerResponse(user);
    }

    // --- Providers ---

    @Transactional(readOnly = true)
    public List<ProviderResponse> getAllProviders() {
        return userRepository.findByRole(Role.PROVIDER).stream()
                .map(this::toProviderResponse)
                .toList();
    }

    @Transactional
    public ProviderResponse createProvider(ProviderRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalStateException("Email already exists.");
        }
        String empCode = (request.employeeCode() == null || request.employeeCode().isBlank())
                ? "PRV-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase()
                : request.employeeCode().trim().toUpperCase();

        if (providerProfileRepository.existsByEmployeeCode(empCode)) {
            throw new IllegalStateException("Employee code already exists.");
        }

        String rawPassword = (request.password() == null || request.password().isBlank())
                ? "Provider@123"
                : request.password();

        User user = new User();
        user.setFullName(request.fullName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(Role.PROVIDER);
        user.setStatus(UserStatus.ACTIVE);
        user.setAuthProvider(AuthProvider.LOCAL);
        user = userRepository.save(user);

        ProviderProfile pp = new ProviderProfile();
        pp.setUser(user);
        pp.setEmployeeCode(empCode);
        pp.setPhone(request.phone());
        pp.setSpecialization(request.specialization());
        pp.setExperienceYears(request.experienceYears() != null ? request.experienceYears() : 0);
        pp.setHourlyRate(request.hourlyRate() != null ? request.hourlyRate() : BigDecimal.ZERO);
        pp.setAvailable(request.available() == null || request.available());
        providerProfileRepository.save(pp);

        return toProviderResponse(user);
    }

    @Transactional
    public ProviderResponse updateProvider(Long userId, ProviderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Provider not found."));
        if (user.getRole() != Role.PROVIDER) {
            throw new IllegalArgumentException("Target user is not a provider.");
        }

        user.setFullName(request.fullName().trim());
        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }
        userRepository.save(user);

        ProviderProfile pp = providerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Provider profile not found."));
        pp.setPhone(request.phone());
        pp.setSpecialization(request.specialization());
        if (request.experienceYears() != null) pp.setExperienceYears(request.experienceYears());
        if (request.hourlyRate() != null) pp.setHourlyRate(request.hourlyRate());
        if (request.available() != null) pp.setAvailable(request.available());
        providerProfileRepository.save(pp);

        return toProviderResponse(user);
    }

    @Transactional
    public void updateUserStatus(Long userId, String statusStr) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        if (user.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Cannot deactivate an admin account.");
        }
        UserStatus status = UserStatus.valueOf(statusStr.trim().toUpperCase());
        user.setStatus(status);
        userRepository.save(user);
    }

    // --- Services & Assignments ---

    @Transactional(readOnly = true)
    public List<ServiceResponse> getAllServices() {
        return serviceItemRepository.findAll().stream()
                .map(this::toServiceResponse)
                .toList();
    }

    @Transactional
    public ServiceResponse createService(ServiceRequest request) {
        String code = request.serviceCode().trim().toUpperCase();
        if (serviceItemRepository.existsByServiceCode(code)) {
            throw new IllegalStateException("Service code already exists.");
        }
        ServiceItem item = new ServiceItem();
        item.setServiceName(request.serviceName().trim());
        item.setServiceCode(code);
        item.setCategory(request.category().trim());
        item.setDescription(request.description());
        item.setBasePrice(request.basePrice());
        item.setDurationMins(request.durationMins());
        item.setActive(request.active() == null || request.active());
        item = serviceItemRepository.save(item);
        return toServiceResponse(item);
    }

    @Transactional
    public ServiceResponse updateService(Long serviceId, ServiceRequest request) {
        ServiceItem item = serviceItemRepository.findById(serviceId)
                .orElseThrow(() -> new IllegalArgumentException("Service not found."));
        item.setServiceName(request.serviceName().trim());
        item.setCategory(request.category().trim());
        item.setDescription(request.description());
        item.setBasePrice(request.basePrice());
        item.setDurationMins(request.durationMins());
        if (request.active() != null) item.setActive(request.active());
        item = serviceItemRepository.save(item);
        return toServiceResponse(item);
    }

    @Transactional
    public ServiceResponse assignProviderToService(AssignProviderRequest request) {
        ProviderProfile provider = providerProfileRepository.findById(request.providerProfileId())
                .orElseThrow(() -> new IllegalArgumentException("Provider not found."));
        ServiceItem serviceItem = serviceItemRepository.findById(request.serviceId())
                .orElseThrow(() -> new IllegalArgumentException("Service not found."));

        if (providerServiceRepository.existsByProviderIdAndServiceItemId(provider.getId(), serviceItem.getId())) {
            throw new IllegalStateException("Provider is already assigned to this service.");
        }

        providerServiceRepository.save(new ProviderService(provider, serviceItem));
        return toServiceResponse(serviceItem);
    }

    @Transactional
    public ServiceResponse unassignProviderFromService(Long providerProfileId, Long serviceId) {
        ProviderService mapping = providerServiceRepository
                .findByProviderIdAndServiceItemId(providerProfileId, serviceId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found."));
        providerServiceRepository.delete(mapping);

        ServiceItem serviceItem = serviceItemRepository.findById(serviceId)
                .orElseThrow(() -> new IllegalArgumentException("Service not found."));
        return toServiceResponse(serviceItem);
    }

    // --- Reports & Stats ---

    @Transactional(readOnly = true)
    public AdminReportResponse getAdminReport() {
        long totalServices = serviceItemRepository.count();
        long activeServices = serviceItemRepository.findByActiveTrue().size();

        return new AdminReportResponse(
                userRepository.countByRole(Role.CUSTOMER),
                userRepository.countByRoleAndStatus(Role.CUSTOMER, UserStatus.ACTIVE),
                userRepository.countByRole(Role.PROVIDER),
                userRepository.countByRoleAndStatus(Role.PROVIDER, UserStatus.ACTIVE),
                totalServices,
                activeServices,
                bookingRepository.count(),
                bookingRepository.countByStatus(BookingStatus.PENDING),
                bookingRepository.countByStatus(BookingStatus.CONFIRMED),
                bookingRepository.countByStatus(BookingStatus.IN_PROGRESS),
                bookingRepository.countByStatus(BookingStatus.COMPLETED),
                bookingRepository.countByStatus(BookingStatus.CANCELLED),
                bookingRepository.getTotalCompletedRevenue()
        );
    }

    // --- Mappers ---

    private CustomerResponse toCustomerResponse(User user) {
        CustomerProfile cp = customerProfileRepository.findByUserId(user.getId()).orElse(null);
        return new CustomerResponse(
                user.getId(),
                cp != null ? cp.getId() : null,
                user.getFullName(),
                user.getEmail(),
                user.getStatus().name(),
                cp != null ? cp.getPhone() : null,
                cp != null ? cp.getAddress() : null,
                cp != null ? cp.getCity() : null
        );
    }

    private ProviderResponse toProviderResponse(User user) {
        ProviderProfile pp = providerProfileRepository.findByUserId(user.getId()).orElse(null);
        return new ProviderResponse(
                user.getId(),
                pp != null ? pp.getId() : null,
                user.getFullName(),
                user.getEmail(),
                user.getStatus().name(),
                pp != null ? pp.getEmployeeCode() : null,
                pp != null ? pp.getPhone() : null,
                pp != null ? pp.getSpecialization() : null,
                pp != null ? pp.getExperienceYears() : 0,
                pp != null ? pp.getHourlyRate() : BigDecimal.ZERO,
                pp != null && pp.isAvailable()
        );
    }

    public ServiceResponse toServiceResponse(ServiceItem item) {
        List<ProviderBrief> providers = providerServiceRepository.findByServiceItemId(item.getId()).stream()
                .map(ps -> {
                    ProviderProfile p = ps.getProvider();
                    return new ProviderBrief(
                            p.getId(),
                            p.getUser().getFullName(),
                            p.getEmployeeCode(),
                            p.getSpecialization(),
                            p.getExperienceYears(),
                            p.getHourlyRate(),
                            p.isAvailable() && p.getUser().getStatus() == UserStatus.ACTIVE
                    );
                })
                .toList();

        return new ServiceResponse(
                item.getId(),
                item.getServiceName(),
                item.getServiceCode(),
                item.getCategory(),
                item.getDescription(),
                item.getBasePrice(),
                item.getDurationMins(),
                item.isActive(),
                providers
        );
    }
}