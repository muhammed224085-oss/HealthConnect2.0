package com.healthconnect.controller;

import com.healthconnect.model.MedicineOrder;
import com.healthconnect.model.OrderItem;
import com.healthconnect.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    
    @Autowired
    private OrderRepository orderRepository;
    
    /**
     * Place a new order from the shopping cart
     * POST /api/orders/place
     * Body: { "patientId": "123", "medicines": [...], "totalPrice": 80 }
     * Returns: { "message": "Order placed successfully", "orderId": "..." }
     */
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody Map<String, Object> orderData) {
        try {
            // Create new order object
            MedicineOrder order = new MedicineOrder();
            
            // Set patient ID
            if (orderData.containsKey("patientId")) {
                order.setPatientId((String) orderData.get("patientId"));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Patient ID is required"));
            }
            
            // Set optional patient details
            if (orderData.containsKey("patientName")) {
                order.setPatientName((String) orderData.get("patientName"));
            }
            if (orderData.containsKey("patientAddress")) {
                order.setPatientAddress((String) orderData.get("patientAddress"));
            }
            if (orderData.containsKey("patientPhone")) {
                order.setPatientPhone((String) orderData.get("patientPhone"));
            }
            
            // Set medicines/items
            if (orderData.containsKey("medicines")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> medicinesData = (List<Map<String, Object>>) orderData.get("medicines");
                List<OrderItem> items = medicinesData.stream().map(med -> {
                    OrderItem item = new OrderItem();
                    if (med.containsKey("medicineId")) {
                        item.setMedicineId(String.valueOf(med.get("medicineId")));
                    }
                    if (med.containsKey("medicineName")) {
                        item.setMedicineName((String) med.get("medicineName"));
                    }
                    if (med.containsKey("name")) {
                        item.setName((String) med.get("name"));
                    }
                    if (med.containsKey("quantity")) {
                        item.setQuantity(((Number) med.get("quantity")).intValue());
                    }
                    if (med.containsKey("price")) {
                        item.setPrice(((Number) med.get("price")).doubleValue());
                    }
                    return item;
                }).toList();
                order.setItems(items);
            }
            
            // Set total amount
            if (orderData.containsKey("totalPrice")) {
                order.setTotalAmount(((Number) orderData.get("totalPrice")).doubleValue());
            } else if (orderData.containsKey("totalAmount")) {
                order.setTotalAmount(((Number) orderData.get("totalAmount")).doubleValue());
            }
            
            // Set default status
            order.setStatus("PLACED");
            
            // Set order date (current date-time)
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            order.setOrderDate(LocalDateTime.now().format(formatter));
            
            // Save to database
            MedicineOrder savedOrder = orderRepository.save(order);
            
            // Return success response
            Map<String, String> response = new HashMap<>();
            response.put("message", "Order placed successfully");
            response.put("orderId", savedOrder.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            // Log the error (in production, use proper logging)
            e.printStackTrace();
            
            // Return error response
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to place order");
            errorResponse.put("details", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody MedicineOrder order) {
        try {
            // Set default values if not provided
            if (order.getStatus() == null || order.getStatus().isEmpty()) {
                order.setStatus("PLACED");
            }
            if (order.getOrderDate() == null || order.getOrderDate().isEmpty()) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                order.setOrderDate(LocalDateTime.now().format(formatter));
            }
            
            MedicineOrder saved = orderRepository.save(order);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to create order", "details", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<MedicineOrder>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable String id) {
        return orderRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicineOrder>> getOrdersByPatient(@PathVariable String patientId) {
        return ResponseEntity.ok(orderRepository.findByPatientId(patientId));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable String id, @RequestBody MedicineOrder order) {
        try {
            Optional<MedicineOrder> existing = orderRepository.findById(id);
            if (existing.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Order not found"));
            }
            
            order.setId(id);
            MedicineOrder updated = orderRepository.save(order);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to update order", "details", e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> status) {
        try {
            Optional<MedicineOrder> existing = orderRepository.findById(id);
            if (existing.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Order not found"));
            }
            
            MedicineOrder order = existing.get();
            order.setStatus(status.get("status"));
            MedicineOrder updated = orderRepository.save(order);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to update order status", "details", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable String id) {
        try {
            Optional<MedicineOrder> existing = orderRepository.findById(id);
            if (existing.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Order not found"));
            }
            
            orderRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Order deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to delete order", "details", e.getMessage()));
        }
    }
}
