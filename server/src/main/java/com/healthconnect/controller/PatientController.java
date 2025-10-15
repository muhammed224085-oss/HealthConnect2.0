package com.healthconnect.controller;

import com.healthconnect.model.Patient;
import com.healthconnect.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientController {
    
    @Autowired
    private PatientRepository patientRepository;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Patient patient) {
        // Check if email already exists
        if (patientRepository.existsByEmail(patient.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Email already registered"));
        }
        
        Patient savedPatient = patientRepository.save(patient);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Patient registered successfully");
        response.put("patient", savedPatient);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        Optional<Patient> patient = patientRepository.findByEmail(email);
        if (patient.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid email or password"));
        }
        
        if (!patient.get().getPassword().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid email or password"));
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("patient", patient.get());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientRepository.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getPatientById(@PathVariable String id) {
        return patientRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable String id, @RequestBody Patient patient) {
        Optional<Patient> existing = patientRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        patient.setId(id);
        Patient updated = patientRepository.save(patient);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable String id) {
        Optional<Patient> existing = patientRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        patientRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Patient deleted successfully"));
    }
}
