package com.healthconnect.controller;

import com.healthconnect.model.Medicine;
import com.healthconnect.service.DataStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicineController {
    
    @Autowired
    private DataStorageService dataStorage;
    
    @PostMapping
    public ResponseEntity<?> createMedicine(@RequestBody Medicine medicine) {
        Medicine saved = dataStorage.saveMedicine(medicine);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @GetMapping
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        return ResponseEntity.ok(dataStorage.getAllMedicines());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getMedicineById(@PathVariable Long id) {
        return dataStorage.getMedicineById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicine(@PathVariable Long id, @RequestBody Medicine medicine) {
        Optional<Medicine> existing = dataStorage.getMedicineById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        medicine.setId(id);
        Medicine updated = dataStorage.saveMedicine(medicine);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id) {
        Optional<Medicine> existing = dataStorage.getMedicineById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        dataStorage.deleteMedicine(id);
        return ResponseEntity.ok(Map.of("message", "Medicine deleted successfully"));
    }
}
