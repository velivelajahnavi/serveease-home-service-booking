package com.serveease.app.repository;

import com.serveease.app.entity.Role;
import com.serveease.app.entity.User;
import com.serveease.app.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    long countByRole(Role role);
    long countByRoleAndStatus(Role role, UserStatus status);
}