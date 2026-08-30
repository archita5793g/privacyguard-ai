
        package com.example.privacyguard_ai.service;

import com.example.privacyguard_ai.entity.Document;
import com.example.privacyguard_ai.entity.User;
import com.example.privacyguard_ai.repository.DocumentRepository;
import com.example.privacyguard_ai.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    private final String uploadDirectory = "uploads";

    public DocumentService(
            DocumentRepository documentRepository,
            UserRepository userRepository) {

        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
    }


    // ================= UPLOAD =================

    public Document uploadDocument(
            Long userId,
            String documentName,
            MultipartFile file) throws IOException {

        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with ID: " + userId
                        )
                );


        // Create uploads folder
        Path uploadPath =
                Paths.get(uploadDirectory)
                        .toAbsolutePath()
                        .normalize();

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }


        // Original file name
        String originalFileName =
                file.getOriginalFilename();

        if (originalFileName == null ||
                originalFileName.isBlank()) {

            originalFileName = "document.pdf";
        }


        // Create unique file name
        String savedFileName =
                System.currentTimeMillis()
                        + "_"
                        + originalFileName;


        // File path
        Path filePath =
                uploadPath.resolve(savedFileName);


        // Save physical file
        Files.copy(
                file.getInputStream(),
                filePath
        );


        // Create database record
        Document document = new Document();


        // Document title
        document.setDocumentName(
                documentName != null &&
                        !documentName.isBlank()
                        ? documentName
                        : originalFileName
        );


        // Saved file name
        document.setFileName(
                savedFileName
        );


        // Physical path
        document.setFilePath(
                filePath.toString()
        );


        // User
        document.setUser(user);


        // Initial privacy status
        document.setPrivacyRisk(
                "NOT ANALYZED"
        );


        // Save database record
        return documentRepository.save(document);
    }


    // ================= GET USER DOCUMENTS =================

    public List<Document> getUserDocuments(Long userId) {

        return documentRepository.findByUserId(userId);
    }


    // ================= GET DOCUMENT =================

    public Document getDocumentById(Long id) {

        return documentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Document not found"
                        )
                );
    }


    // ================= DELETE =================

    public void deleteDocument(Long id) {

        Document document =
                getDocumentById(id);


        try {

            if (document.getFilePath() != null) {

                Path path =
                        Paths.get(
                                document.getFilePath()
                        );

                Files.deleteIfExists(path);
            }

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not delete document file",
                    e
            );
        }


        documentRepository.delete(document);
    }
}

