package com.healthconnect.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    private Long id;
    private Long senderId;
    private Long receiverId;
    private String senderName;
    private String senderType; // DOCTOR or PATIENT
    private String message;
    private String timestamp;
}
