package com.healthconnect.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
    private Long id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private String age;
    private String address;
    private String medicalHistory;
}
