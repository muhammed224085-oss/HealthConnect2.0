package com.healthconnect.controller;

import com.healthconnect.model.Doctor;
import com.healthconnect.repository.DoctorRepository;
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
    private DoctorRepository doctorRepository;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Doctor doctor) {
        // Check if email already exists
        if (doctorRepository.existsByEmail(doctor.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Email already registered"));
        }
        
        Doctor savedDoctor = doctorRepository.save(doctor);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Doctor registered successfully");
        response.put("doctor", savedDoctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        Optional<Doctor> doctor = doctorRepository.findByEmail(email);
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
        return ResponseEntity.ok(doctorRepository.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable String id) {
        return doctorRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable String id, @RequestBody Doctor doctor) {
        Optional<Doctor> existing = doctorRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        doctor.setId(id);
        Doctor updated = doctorRepository.save(doctor);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable String id) {
        Optional<Doctor> existing = doctorRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        doctorRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Doctor deleted successfully"));
    }
}
