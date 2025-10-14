package com.healthconnect.controller;

import com.healthconnect.model.Appointment;
import com.healthconnect.service.DataStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {
    
    @Autowired
    private DataStorageService dataStorage;
    
    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody Appointment appointment) {
        Appointment saved = dataStorage.saveAppointment(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(dataStorage.getAllAppointments());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Long id) {
        return dataStorage.getAppointmentById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(dataStorage.getAppointmentsByDoctorId(doctorId));
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(dataStorage.getAppointmentsByPatientId(patientId));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointment) {
        Optional<Appointment> existing = dataStorage.getAppointmentById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        appointment.setId(id);
        Appointment updated = dataStorage.saveAppointment(appointment);
        return ResponseEntity.ok(updated);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id, @RequestBody Map<String, String> status) {
        Optional<Appointment> existing = dataStorage.getAppointmentById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Appointment appointment = existing.get();
        appointment.setStatus(status.get("status"));
        Appointment updated = dataStorage.saveAppointment(appointment);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        Optional<Appointment> existing = dataStorage.getAppointmentById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        dataStorage.deleteAppointment(id);
        return ResponseEntity.ok(Map.of("message", "Appointment deleted successfully"));
    }
}
