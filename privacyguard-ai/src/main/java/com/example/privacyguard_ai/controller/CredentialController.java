package com.example.privacyguard_ai.controller;

import com.example.privacyguard_ai.entity.Credential;
import com.example.privacyguard_ai.service.CredentialService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credentials")
@CrossOrigin(origins = "*")
public class CredentialController {

    private final CredentialService credentialService;

    public CredentialController(
            CredentialService credentialService) {

        this.credentialService = credentialService;
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Credential> addCredential(
            @PathVariable Long userId,
            @RequestBody Credential credential) {

        return ResponseEntity.ok(
                credentialService.addCredential(
                        userId,
                        credential
                )
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Credential>> getUserCredentials(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                credentialService.getUserCredentials(userId)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Credential> getCredential(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                credentialService.getCredentialById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Credential> updateCredential(
            @PathVariable Long id,
            @RequestBody Credential credential) {

        return ResponseEntity.ok(
                credentialService.updateCredential(
                        id,
                        credential
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCredential(
            @PathVariable Long id) {

        credentialService.deleteCredential(id);

        return ResponseEntity.ok(
                "Credential deleted successfully"
        );
    }
}