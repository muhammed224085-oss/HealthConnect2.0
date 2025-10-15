package com.healthconnect.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "prescriptions")
public class Prescription {
    @Id
    private String id;
    private String appointmentId;
    private String doctorId;
    private String patientId;
    private String doctorName;
    private String patientName;
    private String diagnosis;
    private String medicines;
    private String instructions;
    private String date;
}
