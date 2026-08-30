package com.example.privacyguard_ai.service;

import com.example.privacyguard_ai.dto.LoginRequest;
import com.example.privacyguard_ai.dto.RegisterRequest;
import com.example.privacyguard_ai.entity.User;
import com.example.privacyguard_ai.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // REGISTER
    public User register(RegisterRequest request) {

        if (request.getName() == null ||
                request.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }

        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (request.getPassword() == null ||
                request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setName(request.getName().trim());

        // Database requires username
        user.setUsername(request.getName().trim());

        user.setEmail(request.getEmail().trim());

        // Simple password storage
        user.setPassword(request.getPassword());

        return userRepository.save(user);
    }


    // LOGIN
    public User login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }
}