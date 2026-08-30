package com.example.privacyguard_ai.controller;

import com.example.privacyguard_ai.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(
        origins = {
                "http://127.0.0.1:5500",
                "http://localhost:5500"
        }
)
public class PrivacyScoreController {

    private final UserRepository userRepository;

    public PrivacyScoreController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/privacy-score/{userId}")
    public ResponseEntity<Integer> getPrivacyScore(
            @PathVariable Long userId) {

        if (!userRepository.existsById(userId)) {
            return ResponseEntity.notFound().build();
        }

        // Temporary privacy score
        // Later we can calculate this dynamically.
        return ResponseEntity.ok(100);
    }
}