package com.healthconnect.controller;

import com.healthconnect.model.MedicineOrder;
import com.healthconnect.service.DataStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    
    @Autowired
    private DataStorageService dataStorage;
    
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody MedicineOrder order) {
        MedicineOrder saved = dataStorage.saveOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @GetMapping
    public ResponseEntity<List<MedicineOrder>> getAllOrders() {
        return ResponseEntity.ok(dataStorage.getAllOrders());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable String id) {
        return dataStorage.getOrderById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicineOrder>> getOrdersByPatient(@PathVariable String patientId) {
        return ResponseEntity.ok(dataStorage.getOrdersByPatientId(patientId));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable String id, @RequestBody MedicineOrder order) {
        Optional<MedicineOrder> existing = dataStorage.getOrderById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        order.setId(id);
        MedicineOrder updated = dataStorage.saveOrder(order);
        return ResponseEntity.ok(updated);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> status) {
        Optional<MedicineOrder> existing = dataStorage.getOrderById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        MedicineOrder order = existing.get();
        order.setStatus(status.get("status"));
        MedicineOrder updated = dataStorage.saveOrder(order);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable String id) {
        Optional<MedicineOrder> existing = dataStorage.getOrderById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        dataStorage.deleteOrder(id);
        return ResponseEntity.ok(Map.of("message", "Order deleted successfully"));
    }
}
