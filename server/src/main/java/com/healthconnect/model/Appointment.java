package com.healthconnect.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "appointments")
public class Appointment {
    @Id
    private String id;
    private String patientId;
    private String doctorId;
    private String patientName;
    private String doctorName;
    private String date;
    private String time;
    private String status; // PENDING, CONFIRMED, COMPLETED, CANCELLED
    private String symptoms;
    private String consultationType; // IN_PERSON, VIDEO_CALL, AUDIO_CALL
    private Double consultationFee;
    private String paymentStatus; // UNPAID, PAID
    private String paymentMethod; // CASH, CARD, UPI, NET_BANKING
    private String paymentTime; // BEFORE, AFTER
}
