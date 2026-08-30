package com.example.privacyguard_ai.repository;

import com.example.privacyguard_ai.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository
        extends JpaRepository<Document, Long> {

    List<Document> findByUserId(Long userId);
}
