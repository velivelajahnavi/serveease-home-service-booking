package com.serveease.app.service;

import com.serveease.app.dto.AuthDtos.*;
import com.serveease.app.entity.*;
import com.serveease.app.repository.CustomerProfileRepository;
import com.serveease.app.repository.PasswordResetTokenRepository;
import com.serveease.app.repository.UserRepository;
import com.serveease.app.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       CustomerProfileRepository customerProfileRepository,
                       PasswordResetTokenRepository tokenRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse registerCustomer(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalStateException("An account with this email already exists.");
        }

        User user = new User();
        user.setFullName(request.fullName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.CUSTOMER);
        user.setStatus(UserStatus.ACTIVE);
        user.setAuthProvider(AuthProvider.LOCAL);
        user = userRepository.save(user);

        CustomerProfile profile = new CustomerProfile();
        profile.setUser(user);
        profile.setPhone(request.phone());
        profile.setAddress(request.address());
        profile.setCity(request.city());
        customerProfileRepository.save(profile);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(),
                user.getRole().name(), user.getStatus().name());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password())
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(),
                user.getRole().name(), user.getStatus().name());
    }

    @Transactional
    public MessageResponse createPasswordResetToken(ForgotPasswordRequest request) {
        String email = request.email().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No account found with this email."));

        PasswordResetToken resetToken = tokenRepository.findByUserId(user.getId())
                .orElse(new PasswordResetToken());
        String tokenValue = UUID.randomUUID().toString();
        resetToken.setUser(user);
        resetToken.setToken(tokenValue);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(30));
        tokenRepository.save(resetToken);

        return new MessageResponse("Password reset token generated (valid 30 mins): " + tokenValue);
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = tokenRepository.findByToken(request.token().trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid password reset token."));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Password reset token has expired.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        tokenRepository.delete(resetToken);

        return new MessageResponse("Password has been reset successfully.");
    }
}