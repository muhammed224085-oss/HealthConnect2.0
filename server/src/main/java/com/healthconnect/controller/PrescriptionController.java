package com.healthconnect.controller;

import com.healthconnect.model.Prescription;
import com.healthconnect.service.DataStorageService;
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
    private DataStorageService dataStorage;

    @PostMapping
    public ResponseEntity<?> createPrescription(@RequestBody Prescription prescription) {
        Prescription saved = dataStorage.savePrescription(prescription);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Prescription>> getAllPrescriptions() {
        return ResponseEntity.ok(dataStorage.getAllPrescriptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPrescriptionById(@PathVariable String id) {
        return dataStorage.getPrescriptionById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByPatient(@PathVariable String patientId) {
        return ResponseEntity.ok(dataStorage.getPrescriptionsByPatientId(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByDoctor(@PathVariable String doctorId) {
        return ResponseEntity.ok(dataStorage.getPrescriptionsByDoctorId(doctorId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePrescription(@PathVariable String id, @RequestBody Prescription prescription) {
        Optional<Prescription> existing = dataStorage.getPrescriptionById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        prescription.setId(id);
        Prescription updated = dataStorage.savePrescription(prescription);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePrescription(@PathVariable String id) {
        Optional<Prescription> existing = dataStorage.getPrescriptionById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        dataStorage.deletePrescription(id);
        return ResponseEntity.ok(Map.of("message", "Prescription deleted successfully"));
    }
}
