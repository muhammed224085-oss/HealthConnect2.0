package com.healthconnect.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "admins")
public class Admin {
    @Id
    private String id;
    private String name;
    @Indexed(unique = true)
    private String email;
    private String password;
    private String phone;
    private String role; // ADMIN
    private Boolean isActive;
}
