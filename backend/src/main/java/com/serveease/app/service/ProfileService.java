package com.serveease.app.service;

import com.serveease.app.dto.UserDtos.ProfileResponse;
import com.serveease.app.dto.UserDtos.ProfileUpdateRequest;
import com.serveease.app.entity.CustomerProfile;
import com.serveease.app.entity.ProviderProfile;
import com.serveease.app.entity.Role;
import com.serveease.app.entity.User;
import com.serveease.app.repository.CustomerProfileRepository;
import com.serveease.app.repository.ProviderProfileRepository;
import com.serveease.app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final ProviderProfileRepository providerProfileRepository;

    public ProfileService(UserRepository userRepository,
                          CustomerProfileRepository customerProfileRepository,
                          ProviderProfileRepository providerProfileRepository) {
        this.userRepository = userRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.providerProfileRepository = providerProfileRepository;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        return toProfileResponse(user);
    }

    @Transactional
    public ProfileResponse updateProfile(String email, ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        user.setFullName(request.fullName().trim());
        userRepository.save(user);

        if (user.getRole() == Role.CUSTOMER) {
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
        } else if (user.getRole() == Role.PROVIDER) {
            ProviderProfile pp = providerProfileRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Provider profile not found."));
            pp.setPhone(request.phone());
            if (request.specialization() != null) pp.setSpecialization(request.specialization());
            if (request.experienceYears() != null) pp.setExperienceYears(request.experienceYears());
            if (request.hourlyRate() != null) pp.setHourlyRate(request.hourlyRate());
            if (request.available() != null) pp.setAvailable(request.available());
            providerProfileRepository.save(pp);
        }

        return toProfileResponse(user);
    }

    @Transactional
    public ProfileResponse toggleProviderAvailability(String email, boolean available) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        ProviderProfile pp = providerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Provider profile not found."));
        pp.setAvailable(available);
        providerProfileRepository.save(pp);
        return toProfileResponse(user);
    }

    private ProfileResponse toProfileResponse(User user) {
        CustomerProfile cp = user.getRole() == Role.CUSTOMER
                ? customerProfileRepository.findByUserId(user.getId()).orElse(null)
                : null;
        ProviderProfile pp = user.getRole() == Role.PROVIDER
                ? providerProfileRepository.findByUserId(user.getId()).orElse(null)
                : null;

        return new ProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                user.getStatus().name(),
                user.getAuthProvider().name(),
                cp != null ? cp.getPhone() : (pp != null ? pp.getPhone() : null),
                cp != null ? cp.getAddress() : null,
                cp != null ? cp.getCity() : null,
                pp != null ? pp.getEmployeeCode() : null,
                pp != null ? pp.getSpecialization() : null,
                pp != null ? pp.getExperienceYears() : null,
                pp != null ? pp.getHourlyRate() : null,
                pp != null ? pp.isAvailable() : null
        );
    }
}