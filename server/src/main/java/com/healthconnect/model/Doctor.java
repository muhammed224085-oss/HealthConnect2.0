package com.healthconnect.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {
    private Long id;
    private String name;
    private String email;
    private String password;
    private String specialization;
    private String phone;
    private String experience;
    private String qualification;
}
