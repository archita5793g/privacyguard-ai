package com.example.privacyguard_ai.controller;

import com.example.privacyguard_ai.dto.AIRequest;
import com.example.privacyguard_ai.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }


    // FEATURE 1
    // AI Privacy Assistant

    @PostMapping("/privacy-advice")
    public ResponseEntity<Map<String, String>> privacyAdvice(
            @RequestBody AIRequest request) {

        String response =
                aiService.privacyAssistant(
                        request.getMessage()
                );

        return ResponseEntity.ok(
                Map.of("response", response)
        );
    }


    // FEATURE 2
    // Document Privacy Risk Analyzer

    @PostMapping("/analyze-document")
    public ResponseEntity<Map<String, String>> analyzeDocument(
            @RequestBody AIRequest request) {

        String response =
                aiService.analyzeDocument(
                        request.getMessage()
                );

        return ResponseEntity.ok(
                Map.of("response", response)
        );
    }


    // FEATURE 3
    // Sensitive Data Detector

    @PostMapping("/detect-sensitive-data")
    public ResponseEntity<Map<String, String>> detectSensitiveData(
            @RequestBody AIRequest request) {

        String response =
                aiService.detectSensitiveData(
                        request.getMessage()
                );

        return ResponseEntity.ok(
                Map.of("response", response)
        );
    }


    // FEATURE 4
    // Sharing Recommendation

    @PostMapping("/check-sharing")
    public ResponseEntity<Map<String, String>> checkSharing(
            @RequestBody AIRequest request) {

        String response =
                aiService.sharingRecommendation(
                        request.getMessage()
                );

        return ResponseEntity.ok(
                Map.of("response", response)
        );
    }


    // FEATURE 5
    // Document Summarizer

    @PostMapping("/summarize")
    public ResponseEntity<Map<String, String>> summarize(
            @RequestBody AIRequest request) {

        String response =
                aiService.summarizeDocument(
                        request.getMessage()
                );

        return ResponseEntity.ok(
                Map.of("response", response)
        );
    }
}