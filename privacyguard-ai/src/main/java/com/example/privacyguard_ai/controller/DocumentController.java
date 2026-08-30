package com.example.privacyguard_ai.controller;

import com.example.privacyguard_ai.entity.Document;
import com.example.privacyguard_ai.service.DocumentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentService documentService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }


    // =========================================================
    // UPLOAD DOCUMENT
    // POST:
    // /api/documents/upload
    // =========================================================

    @PostMapping(
            value = "/upload",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<Document> uploadDocument(

            @RequestParam("userId")
            Long userId,

            @RequestParam("documentName")
            String documentName,

            @RequestParam("file")
            MultipartFile file

    ) throws IOException {


        // Check file
        if (file == null || file.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }


        // Check PDF
        String originalFileName =
                file.getOriginalFilename();

        if (originalFileName == null ||
                !originalFileName
                        .toLowerCase()
                        .endsWith(".pdf")) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }


        // Check 10 MB
        if (file.getSize() >
                10 * 1024 * 1024) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }


        Document document =
                documentService.uploadDocument(
                        userId,
                        documentName,
                        file
                );


        return ResponseEntity.ok(document);
    }


    // =========================================================
    // GET USER DOCUMENTS
    // GET:
    // /api/documents/user/{userId}
    // =========================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Document>> getUserDocuments(

            @PathVariable("userId")
            Long userId

    ) {

        List<Document> documents =
                documentService
                        .getUserDocuments(userId);


        return ResponseEntity.ok(documents);
    }


    // =========================================================
    // GET DOCUMENT COUNT
    // GET:
    // /api/documents/count/{userId}
    // =========================================================

    @GetMapping("/count/{userId}")
    public ResponseEntity<Long> getDocumentCount(

            @PathVariable("userId")
            Long userId

    ) {

        long count =
                documentService
                        .getUserDocuments(userId)
                        .size();


        return ResponseEntity.ok(count);
    }


    // =========================================================
    // GET SINGLE DOCUMENT
    // GET:
    // /api/documents/{id}
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocument(

            @PathVariable("id")
            Long id

    ) {

        Document document =
                documentService
                        .getDocumentById(id);


        return ResponseEntity.ok(document);
    }


    // =========================================================
    // DELETE DOCUMENT
    // DELETE:
    // /api/documents/{id}
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDocument(

            @PathVariable("id")
            Long id

    ) {

        documentService.deleteDocument(id);


        return ResponseEntity.ok(
                "Document deleted successfully"
        );
    }

}