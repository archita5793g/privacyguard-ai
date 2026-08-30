package com.example.privacyguard_ai.service;

import com.example.privacyguard_ai.entity.User;
import com.example.privacyguard_ai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    // Update user
    public User updateUser(Long id, User updatedUser) {

        User user = getUserById(id);

        if (updatedUser.getUsername() != null &&
                !updatedUser.getUsername().trim().isEmpty()) {

            user.setUsername(
                    updatedUser.getUsername().trim()
            );
        }

        if (updatedUser.getEmail() != null &&
                !updatedUser.getEmail().trim().isEmpty()) {

            user.setEmail(
                    updatedUser.getEmail().trim().toLowerCase()
            );
        }

        return userRepository.save(user);
    }

    // Delete user
    public void deleteUser(Long id) {

        User user = getUserById(id);

        userRepository.delete(user);
    }
}