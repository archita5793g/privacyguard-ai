package com.example.privacyguard_ai.controller;

import com.example.privacyguard_ai.dto.LoginRequest;
import com.example.privacyguard_ai.dto.RegisterRequest;
import com.example.privacyguard_ai.entity.User;
import com.example.privacyguard_ai.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
        origins = {
                "http://localhost:5500",
                "http://127.0.0.1:5500"
        }
)
public class AuthController {

    private final AuthService authService;


    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        try {

            User user =
                    authService.register(request);


            Map<String, Object> response =
                    new HashMap<>();

            response.put("message",
                    "Registration successful");

            response.put("id",
                    user.getId());

            response.put("name",
                    user.getName());

            response.put("username",
                    user.getUsername());

            response.put("email",
                    user.getEmail());


            return ResponseEntity.ok(response);

        } catch (Exception e) {

            Map<String, String> response =
                    new HashMap<>();

            response.put(
                    "message",
                    e.getMessage()
            );


            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }


    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            User user =
                    authService.login(request);


            Map<String, Object> response =
                    new HashMap<>();

            response.put("message",
                    "Login successful");

            response.put("id",
                    user.getId());

            response.put("name",
                    user.getName());

            response.put("username",
                    user.getUsername());

            response.put("email",
                    user.getEmail());


            return ResponseEntity.ok(response);

        } catch (Exception e) {

            Map<String, String> response =
                    new HashMap<>();

            response.put(
                    "message",
                    e.getMessage()
            );


            return ResponseEntity
                    .badRequest()
                    .body(response);
        }
    }
}