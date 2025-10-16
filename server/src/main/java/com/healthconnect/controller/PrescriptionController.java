package com.healthconnect.controller;

import com.healthconnect.model.Prescription;
import com.healthconnect.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "http://localhost:3000")
public class PrescriptionController {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @PostMapping
    public ResponseEntity<?> createPrescription(@RequestBody Prescription prescription) {
        Prescription saved = prescriptionRepository.save(prescription);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Prescription>> getAllPrescriptions() {
        return ResponseEntity.ok(prescriptionRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPrescriptionById(@PathVariable String id) {
        return prescriptionRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByPatient(@PathVariable String patientId) {
        return ResponseEntity.ok(prescriptionRepository.findByPatientId(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByDoctor(@PathVariable String doctorId) {
        return ResponseEntity.ok(prescriptionRepository.findByDoctorId(doctorId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePrescription(@PathVariable String id, @RequestBody Prescription prescription) {
        Optional<Prescription> existing = prescriptionRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        prescription.setId(id);
        Prescription updated = prescriptionRepository.save(prescription);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePrescription(@PathVariable String id) {
        Optional<Prescription> existing = prescriptionRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        prescriptionRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Prescription deleted successfully"));
    }
}
