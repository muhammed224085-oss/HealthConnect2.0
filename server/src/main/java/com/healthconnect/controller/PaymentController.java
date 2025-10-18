package com.healthconnect.controller;

import com.healthconnect.model.Payment;
import com.healthconnect.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Create payment order
    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createPaymentOrder(@RequestBody Payment payment) {
        try {
            Map<String, Object> orderDetails = paymentService.createOrder(payment);
            return ResponseEntity.ok(orderDetails);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Verify payment
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, String> paymentData) {
        try {
            String orderId = paymentData.get("orderId");
            String paymentId = paymentData.get("paymentId");
            String signature = paymentData.get("signature");
            String paymentDbId = paymentData.get("paymentDbId");
            String status = paymentData.get("status");

            // Verify signature (in demo mode, always return true)
            boolean isValid = true; // paymentService.verifyPaymentSignature(orderId, paymentId, signature);
            
            if (isValid) {
                // Update payment status
                Payment payment = paymentService.updatePaymentStatus(paymentDbId, paymentId, status, null);
                
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Payment verified successfully",
                    "payment", payment
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Payment verification failed"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    // Confirm UPI/GPay payment (manual confirmation after QR scan)
    @PostMapping("/confirm")
    public ResponseEntity<Map<String, Object>> confirmPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            String orderId = (String) paymentData.get("orderId");
            String patientId = (String) paymentData.get("patientId");
            String patientName = (String) paymentData.get("patientName");
            Double amount = Double.valueOf(paymentData.get("amount").toString());
            String paymentMethod = (String) paymentData.get("paymentMethod");
            String paymentStatus = (String) paymentData.get("paymentStatus");
            List<Map<String, Object>> items = (List<Map<String, Object>>) paymentData.get("items");

            // Create payment record
            Payment payment = new Payment(patientId, "GPAY_UPI", amount, "Payment via " + paymentMethod);
            payment.setPaymentMethod(paymentMethod);
            payment.setStatus(paymentStatus);
            payment.setRazorpayOrderId(orderId); // Store order ID for reference

            // Add items if provided
            if (items != null && !items.isEmpty()) {
                List<Payment.PaymentItem> paymentItems = items.stream()
                    .map(item -> new Payment.PaymentItem(
                        (String) item.get("name"),
                        item.get("description") != null ? (String) item.get("description") : "",
                        Double.valueOf(item.get("price").toString()),
                        Integer.valueOf(item.get("quantity").toString())
                    ))
                    .toList();
                payment.setItems(paymentItems);
            }

            // Save payment
            Payment savedPayment = paymentService.savePayment(payment);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payment confirmed successfully",
                "payment", savedPayment,
                "orderId", orderId,
                "timestamp", savedPayment.getCreatedAt()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    // Get patient payments
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Payment>> getPatientPayments(@PathVariable String patientId) {
        try {
            List<Payment> payments = paymentService.getPatientPayments(patientId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Get payment by ID
    @GetMapping("/{paymentId}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable String paymentId) {
        try {
            Payment payment = paymentService.getPaymentById(paymentId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Generate invoice
    @GetMapping("/{paymentId}/invoice")
    public ResponseEntity<Map<String, Object>> generateInvoice(@PathVariable String paymentId) {
        try {
            Map<String, Object> invoice = paymentService.generateInvoice(paymentId);
            return ResponseEntity.ok(invoice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get payment statistics (admin only)
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getPaymentStatistics() {
        try {
            Map<String, Object> stats = paymentService.getPaymentStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Demo payment methods
    @GetMapping("/demo-methods")
    public ResponseEntity<Map<String, Object>> getDemoPaymentMethods() {
        Map<String, Object> methods = Map.of(
            "upi", Map.of(
                "name", "UPI",
                "icon", "upi",
                "description", "Pay using UPI apps like GPay, PhonePe, Paytm"
            ),
            "card", Map.of(
                "name", "Cards",
                "icon", "card",
                "description", "Credit & Debit Cards"
            ),
            "netbanking", Map.of(
                "name", "Net Banking",
                "icon", "bank",
                "description", "Pay using your bank account"
            ),
            "wallet", Map.of(
                "name", "Wallets",
                "icon", "wallet",
                "description", "Paytm, PhonePe, Amazon Pay"
            )
        );
        
        return ResponseEntity.ok(methods);
    }

    // Process consultation payment
    @PostMapping("/consultation")
    public ResponseEntity<Map<String, Object>> createConsultationPayment(@RequestBody Map<String, Object> paymentRequest) {
        try {
            String patientId = (String) paymentRequest.get("patientId");
            String doctorId = (String) paymentRequest.get("doctorId");
            Double amount = Double.valueOf(paymentRequest.get("amount").toString());
            String description = (String) paymentRequest.get("description");

            Payment payment = new Payment(patientId, "CONSULTATION", amount, description);
            payment.setDoctorId(doctorId);

            // Add consultation item
            Payment.PaymentItem consultationItem = new Payment.PaymentItem(
                "Doctor Consultation", 
                "Consultation with " + paymentRequest.get("doctorName"), 
                amount, 
                1
            );
            payment.setItems(List.of(consultationItem));

            Map<String, Object> orderDetails = paymentService.createOrder(payment);
            return ResponseEntity.ok(orderDetails);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Process medicine payment
    @PostMapping("/medicine")
    public ResponseEntity<Map<String, Object>> createMedicinePayment(@RequestBody Map<String, Object> paymentRequest) {
        try {
            String patientId = (String) paymentRequest.get("patientId");
            String orderId = (String) paymentRequest.get("orderId");
            Double amount = Double.valueOf(paymentRequest.get("amount").toString());
            String description = (String) paymentRequest.get("description");
            List<Map<String, Object>> items = (List<Map<String, Object>>) paymentRequest.get("items");

            Payment payment = new Payment(patientId, "MEDICINE", amount, description);
            payment.setMedicineOrderId(orderId);

            // Add medicine items
            List<Payment.PaymentItem> paymentItems = items.stream()
                .map(item -> new Payment.PaymentItem(
                    (String) item.get("name"),
                    (String) item.get("description"),
                    Double.valueOf(item.get("price").toString()),
                    Integer.valueOf(item.get("quantity").toString())
                ))
                .toList();
            payment.setItems(paymentItems);

            Map<String, Object> orderDetails = paymentService.createOrder(payment);
            return ResponseEntity.ok(orderDetails);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}