package com.serveease.app.security;

import com.serveease.app.entity.*;
import com.serveease.app.repository.CustomerProfileRepository;
import com.serveease.app.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final JwtUtil jwtUtil;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public OAuth2LoginSuccessHandler(UserRepository userRepository,
                                     CustomerProfileRepository customerProfileRepository,
                                     JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(name != null ? name : email.split("@")[0]);
            newUser.setRole(Role.CUSTOMER);
            newUser.setStatus(UserStatus.ACTIVE);
            newUser.setAuthProvider(AuthProvider.GOOGLE);
            User savedUser = userRepository.save(newUser);

            CustomerProfile profile = new CustomerProfile();
            profile.setUser(savedUser);
            customerProfileRepository.save(profile);
            return savedUser;
        });

        if (user.getStatus() != UserStatus.ACTIVE) {
            String errorUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/login")
                    .queryParam("error", "account_inactive")
                    .build().toUriString();
            getRedirectStrategy().sendRedirect(request, response, errorUrl);
            return;
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        String targetUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth2/callback")
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}