package com.example.privacyguard_ai.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class AIService {

    private final RestClient restClient;

    private final String apiKey = System.getenv("OPENAI_API_KEY");

    public AIService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .build();
    }

    // 1. Privacy Assistant
    public String privacyAssistant(String question) {

        String prompt = """
                You are PrivacyGuard AI, a privacy assistant
                for a digital identity wallet.

                Give simple and safe privacy advice.

                Never ask users for:
                - Aadhaar number
                - PAN number
                - Password
                - OTP
                - Bank account number

                User question:
                """ + question;

        return callAI(prompt);
    }


    // 2. Document Privacy Risk
    public String analyzeDocument(String documentText) {

        String prompt = """
                Analyze this document from a privacy perspective.

                Give:
                1. Risk level: LOW, MEDIUM or HIGH
                2. Sensitive information categories
                3. Privacy risks
                4. Recommendations

                Never reproduce actual sensitive values.

                Document:
                """ + documentText;

        return callAI(prompt);
    }


    // 3. Sensitive Data Detection
    public String detectSensitiveData(String text) {

        String prompt = """
                Identify categories of sensitive personal
                information in this text.

                Check for:
                Aadhaar
                PAN
                Phone number
                Email
                Date of birth
                Address
                Bank information
                Government ID

                Do not display actual sensitive values.

                Text:
                """ + text;

        return callAI(prompt);
    }


    // 4. Sharing Recommendation
    public String sharingRecommendation(String documentText) {

        String prompt = """
                Act as a digital privacy advisor.

                Analyze this document and tell me whether
                it is safe to share.

                Provide:
                - Sharing risk
                - Information that should be protected
                - Information that can be shared
                - Safety recommendations

                Do not reveal sensitive values.

                Document:
                """ + documentText;

        return callAI(prompt);
    }


    // 5. Document Summary
    public String summarizeDocument(String documentText) {

        String prompt = """
                Summarize this document in simple language.

                Include:
                - Document type
                - Main purpose
                - Important non-sensitive information
                - Privacy sensitivity

                Never reproduce sensitive identification numbers.

                Document:
                """ + documentText;

        return callAI(prompt);
    }


    // Common AI method
    private String callAI(String prompt) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException(
                    "OPENAI_API_KEY environment variable is not configured"
            );
        }

        Map<String, Object> request = Map.of(
                "model", "gpt-4o-mini",
                "messages", new Object[]{
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                },
                "temperature", 0.3
        );

        Map response = restClient
                .post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .body(request)
                .retrieve()
                .body(Map.class);

        if (response == null) {
            throw new RuntimeException("Empty AI response");
        }

        var choices = (java.util.List<Map<String, Object>>)
                response.get("choices");

        if (choices == null || choices.isEmpty()) {
            throw new RuntimeException("No AI response received");
        }

        Map<String, Object> firstChoice = choices.get(0);

        Map<String, Object> message =
                (Map<String, Object>) firstChoice.get("message");

        return String.valueOf(message.get("content"));
    }
}