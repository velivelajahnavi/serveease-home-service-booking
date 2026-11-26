package com.serveease.app.controller;

import com.serveease.app.dto.UserDtos.ProfileResponse;
import com.serveease.app.dto.UserDtos.ProfileUpdateRequest;
import com.serveease.app.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ProfileResponse getProfile(Authentication authentication) {
        return profileService.getProfile(authentication.getName());
    }

    @PutMapping
    public ProfileResponse updateProfile(Authentication authentication,
                                         @Valid @RequestBody ProfileUpdateRequest request) {
        return profileService.updateProfile(authentication.getName(), request);
    }
}