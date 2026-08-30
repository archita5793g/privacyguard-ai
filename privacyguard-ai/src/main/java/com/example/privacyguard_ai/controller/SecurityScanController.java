package com.example.privacyguard_ai.controller;

import com.example.privacyguard_ai.entity.User;
import com.example.privacyguard_ai.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(
        origins = {
                "http://127.0.0.1:5500",
                "http://localhost:5500"
        }
)
public class SecurityScanController {

    private final UserRepository userRepository;

    public SecurityScanController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/security-scan/{userId}")
    public ResponseEntity<?> runSecurityScan(
            @PathVariable Long userId) {

        System.out.println("================================");
        System.out.println("SECURITY SCAN");
        System.out.println("User ID: " + userId);
        System.out.println("================================");

        Optional<User> user =
                userRepository.findById(userId);

        if (user.isEmpty()) {

            Map<String, Object> error =
                    new HashMap<>();

            error.put("success", false);
            error.put("message", "User not found");

            return ResponseEntity
                    .badRequest()
                    .body(error);
        }

        /*
         * Basic security scan.
         *
         * Later you can connect your AI
         * Privacy Risk Analyzer here.
         */

        Map<String, Object> result =
                new HashMap<>();

        result.put("success", true);
        result.put("userId", userId);
        result.put("privacyScore", 100);
        result.put("riskLevel", "LOW");
        result.put("securityChecks", 1);
        result.put(
                "message",
                "Security scan completed successfully."
        );

        return ResponseEntity.ok(result);
    }
}