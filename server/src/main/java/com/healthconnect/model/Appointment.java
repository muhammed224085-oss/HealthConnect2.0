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
}
