package com.healthconnect.controller;

import com.healthconnect.model.Patient;
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
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientController {
    
    @Autowired
    private DataStorageService dataStorage;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Patient patient) {
        // Check if email already exists
        Optional<Patient> existing = dataStorage.getPatientByEmail(patient.getEmail());
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Email already registered"));
        }
        
        Patient savedPatient = dataStorage.savePatient(patient);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Patient registered successfully");
        response.put("patient", savedPatient);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        Optional<Patient> patient = dataStorage.getPatientByEmail(email);
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
        return ResponseEntity.ok(dataStorage.getAllPatients());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getPatientById(@PathVariable Long id) {
        return dataStorage.getPatientById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        Optional<Patient> existing = dataStorage.getPatientById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        patient.setId(id);
        Patient updated = dataStorage.savePatient(patient);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        Optional<Patient> existing = dataStorage.getPatientById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        dataStorage.deletePatient(id);
        return ResponseEntity.ok(Map.of("message", "Patient deleted successfully"));
    }
}
