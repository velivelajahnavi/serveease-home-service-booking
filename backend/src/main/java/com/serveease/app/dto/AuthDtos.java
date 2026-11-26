package com.serveease.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {

    public record RegisterRequest(
            @NotBlank(message = "Full name is required") String fullName,
            @NotBlank(message = "Email is required") @Email(message = "Valid email is required") String email,
            @NotBlank(message = "Password is required") @Size(min = 6, message = "Password must be at least 6 characters") String password,
            String phone,
            String address,
            String city
    ) {}

    public record LoginRequest(
            @NotBlank(message = "Email is required") @Email(message = "Valid email is required") String email,
            @NotBlank(message = "Password is required") String password
    ) {}

    public record AuthResponse(
            String token,
            Long userId,
            String fullName,
            String email,
            String role,
            String status
    ) {}

    public record ForgotPasswordRequest(
            @NotBlank(message = "Email is required") @Email String email
    ) {}

    public record ResetPasswordRequest(
            @NotBlank(message = "Token is required") String token,
            @NotBlank(message = "New password is required") @Size(min = 6, message = "Password must be at least 6 characters") String newPassword
    ) {}

    public record MessageResponse(String message) {}
}