package com.example.privacyguard_ai.service;

import com.example.privacyguard_ai.entity.Credential;
import com.example.privacyguard_ai.entity.User;
import com.example.privacyguard_ai.repository.CredentialRepository;
import com.example.privacyguard_ai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CredentialService {

    private final CredentialRepository credentialRepository;
    private final UserRepository userRepository;

    public CredentialService(
            CredentialRepository credentialRepository,
            UserRepository userRepository) {

        this.credentialRepository = credentialRepository;
        this.userRepository = userRepository;
    }

    public Credential addCredential(
            Long userId,
            Credential credential) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        credential.setUser(user);

        return credentialRepository.save(credential);
    }

    public List<Credential> getUserCredentials(Long userId) {

        return credentialRepository.findByUserId(userId);
    }

    public Credential getCredentialById(Long id) {

        return credentialRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Credential not found"));
    }

    public Credential updateCredential(
            Long id,
            Credential updatedCredential) {

        Credential credential = getCredentialById(id);

        credential.setCredentialName(
                updatedCredential.getCredentialName());

        credential.setCredentialType(
                updatedCredential.getCredentialType());

        credential.setIssuer(
                updatedCredential.getIssuer());

        return credentialRepository.save(credential);
    }

    public void deleteCredential(Long id) {

        Credential credential = getCredentialById(id);

        credentialRepository.delete(credential);
    }
}