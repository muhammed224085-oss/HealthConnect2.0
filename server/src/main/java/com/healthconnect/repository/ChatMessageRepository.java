package com.healthconnect.repository;

import com.healthconnect.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByPatientIdOrderByTimestampDesc(String patientId);
    List<ChatMessage> findTop10ByPatientIdOrderByTimestampDesc(String patientId);
}
