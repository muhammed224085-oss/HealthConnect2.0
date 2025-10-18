package com.healthconnect.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat_history")
public class ChatMessage {
    @Id
    private String id;
    private String patientId;
    private String patientName;
    private String userMessage;
    private String botResponse;
    private String suggestedDoctor;
    private String suggestedSpecialization;
    private LocalDateTime timestamp;
    private String messageType; // SYMPTOM, DISEASE, MEDICINE, GENERAL
}
