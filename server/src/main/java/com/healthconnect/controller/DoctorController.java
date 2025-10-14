package com.healthconnect.controller;

import com.healthconnect.model.Doctor;
import com.healthconnect.service.DataStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:3000")
public class DoctorController {
    
    @Autowired
    private DataStorageService dataStorage;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Doctor doctor) {
        // Check if email already exists
        Optional<Doctor> existing = dataStorage.getDoctorByEmail(doctor.getEmail());
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Email already registered"));
        }
        
        Doctor savedDoctor = dataStorage.saveDoctor(doctor);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Doctor registered successfully");
        response.put("doctor", savedDoctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        Optional<Doctor> doctor = dataStorage.getDoctorByEmail(email);
        if (doctor.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid email or password"));
        }
        
        if (!doctor.get().getPassword().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid email or password"));
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("doctor", doctor.get());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(dataStorage.getAllDoctors());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable Long id) {
        return dataStorage.getDoctorById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor) {
        Optional<Doctor> existing = dataStorage.getDoctorById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        doctor.setId(id);
        Doctor updated = dataStorage.saveDoctor(doctor);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        Optional<Doctor> existing = dataStorage.getDoctorById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        dataStorage.deleteDoctor(id);
        return ResponseEntity.ok(Map.of("message", "Doctor deleted successfully"));
    }
}
