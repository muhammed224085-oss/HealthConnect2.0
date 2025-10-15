package com.healthconnect.controller;

import com.healthconnect.model.Medicine;
import com.healthconnect.repository.MedicineRepository;
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
    private MedicineRepository medicineRepository;
    
    @PostMapping
    public ResponseEntity<?> createMedicine(@RequestBody Medicine medicine) {
        Medicine saved = medicineRepository.save(medicine);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @GetMapping
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        return ResponseEntity.ok(medicineRepository.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getMedicineById(@PathVariable String id) {
        return medicineRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Medicine>> searchMedicines(@RequestParam String query) {
        return ResponseEntity.ok(medicineRepository.findByNameContainingIgnoreCase(query));
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Medicine>> getMedicinesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(medicineRepository.findByCategory(category));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicine(@PathVariable String id, @RequestBody Medicine medicine) {
        Optional<Medicine> existing = medicineRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        medicine.setId(id);
        Medicine updated = medicineRepository.save(medicine);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable String id) {
        Optional<Medicine> existing = medicineRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        medicineRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Medicine deleted successfully"));
    }
}
