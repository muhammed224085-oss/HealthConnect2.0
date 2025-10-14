package com.healthconnect.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prescription {
    private Long id;
    private Long appointmentId;
    private Long doctorId;
    private Long patientId;
    private String doctorName;
    private String patientName;
    private String diagnosis;
    private String medicines;
    private String instructions;
    private String date;
}
