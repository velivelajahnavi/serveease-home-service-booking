package com.serveease.app.config;

import com.serveease.app.entity.*;
import com.serveease.app.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final ProviderServiceRepository providerServiceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      CustomerProfileRepository customerProfileRepository,
                      ProviderProfileRepository providerProfileRepository,
                      ServiceItemRepository serviceItemRepository,
                      ProviderServiceRepository providerServiceRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.serviceItemRepository = serviceItemRepository;
        this.providerServiceRepository = providerServiceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Admin Account
        User admin = new User();
        admin.setEmail("admin@serveease.com");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setFullName("System Administrator");
        admin.setRole(Role.ADMIN);
        admin.setStatus(UserStatus.ACTIVE);
        admin.setAuthProvider(AuthProvider.LOCAL);
        userRepository.save(admin);

        // 2. Customer Account
        User customerUser = new User();
        customerUser.setEmail("customer@serveease.com");
        customerUser.setPassword(passwordEncoder.encode("Customer@123"));
        customerUser.setFullName("Aarav Sharma");
        customerUser.setRole(Role.CUSTOMER);
        customerUser.setStatus(UserStatus.ACTIVE);
        customerUser.setAuthProvider(AuthProvider.LOCAL);
        customerUser = userRepository.save(customerUser);

        CustomerProfile customerProfile = new CustomerProfile();
        customerProfile.setUser(customerUser);
        customerProfile.setPhone("9876543210");
        customerProfile.setAddress("Flat 302, Green Park Residency, Brodipet");
        customerProfile.setCity("Guntur");
        customerProfileRepository.save(customerProfile);

        // 3. Provider 1
        User providerUser1 = new User();
        providerUser1.setEmail("ravi.provider@serveease.com");
        providerUser1.setPassword(passwordEncoder.encode("Provider@123"));
        providerUser1.setFullName("Ravi Kumar");
        providerUser1.setRole(Role.PROVIDER);
        providerUser1.setStatus(UserStatus.ACTIVE);
        providerUser1.setAuthProvider(AuthProvider.LOCAL);
        providerUser1 = userRepository.save(providerUser1);

        ProviderProfile provider1 = new ProviderProfile();
        provider1.setUser(providerUser1);
        provider1.setEmployeeCode("PRV-1001");
        provider1.setPhone("9123456780");
        provider1.setSpecialization("Plumbing & Electrical");
        provider1.setExperienceYears(6);
        provider1.setHourlyRate(new BigDecimal("350.00"));
        provider1.setAvailable(true);
        provider1 = providerProfileRepository.save(provider1);

        // 4. Provider 2
        User providerUser2 = new User();
        providerUser2.setEmail("anita.provider@serveease.com");
        providerUser2.setPassword(passwordEncoder.encode("Provider@123"));
        providerUser2.setFullName("Anita Reddy");
        providerUser2.setRole(Role.PROVIDER);
        providerUser2.setStatus(UserStatus.ACTIVE);
        providerUser2.setAuthProvider(AuthProvider.LOCAL);
        providerUser2 = userRepository.save(providerUser2);

        ProviderProfile provider2 = new ProviderProfile();
        provider2.setUser(providerUser2);
        provider2.setEmployeeCode("PRV-1002");
        provider2.setPhone("9234567890");
        provider2.setSpecialization("AC Repair & Deep Cleaning");
        provider2.setExperienceYears(5);
        provider2.setHourlyRate(new BigDecimal("450.00"));
        provider2.setAvailable(true);
        provider2 = providerProfileRepository.save(provider2);

        // 5. Services
        ServiceItem s1 = createService("Pipe & Tap Leak Repair", "SRV-PLM-01", "Plumbing",
                "Quick diagnosis and repair for leaking taps, pipes, and bathroom fittings.",
                new BigDecimal("499.00"), 60);
        ServiceItem s2 = createService("Ceiling Fan & Switchboard Repair", "SRV-ELC-01", "Electrical",
                "Fan regulator, wiring check, and modular switchboard repair.",
                new BigDecimal("399.00"), 60);
        ServiceItem s3 = createService("AC Jet Pump Service", "SRV-ACR-01", "Appliance Repair",
                "Complete split/window AC filter, coil jet wash, and cooling check.",
                new BigDecimal("799.00"), 90);
        ServiceItem s4 = createService("2BHK Full Home Deep Cleaning", "SRV-CLN-01", "Home Cleaning",
                "Machine floor scrubbing, kitchen degreasing, and bathroom sanitization.",
                new BigDecimal("1999.00"), 180);

        // 6. Assign Providers to Services
        providerServiceRepository.save(new ProviderService(provider1, s1));
        providerServiceRepository.save(new ProviderService(provider1, s2));
        providerServiceRepository.save(new ProviderService(provider2, s3));
        providerServiceRepository.save(new ProviderService(provider2, s4));
    }

    private ServiceItem createService(String name, String code, String category,
                                      String description, BigDecimal price, int durationMins) {
        ServiceItem item = new ServiceItem();
        item.setServiceName(name);
        item.setServiceCode(code);
        item.setCategory(category);
        item.setDescription(description);
        item.setBasePrice(price);
        item.setDurationMins(durationMins);
        item.setActive(true);
        return serviceItemRepository.save(item);
    }
}