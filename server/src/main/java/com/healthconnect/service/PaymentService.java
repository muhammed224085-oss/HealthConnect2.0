package com.healthconnect.service;

import com.healthconnect.model.Payment;
import com.healthconnect.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private WalletService walletService;

    @Value("${razorpay.key.id:rzp_test_1234567890}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:razorpay_secret_key}")
    private String razorpayKeySecret;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String RAZORPAY_API_URL = "https://api.razorpay.com/v1";

    // Create Razorpay order
    public Map<String, Object> createOrder(Payment payment) {
        try {
            // Save payment with pending status
            payment.setPaymentStatus("PENDING");
            payment.setInvoiceNumber(generateInvoiceNumber());
            Payment savedPayment = paymentRepository.save(payment);

            // Create Razorpay order
            Map<String, Object> orderData = new HashMap<>();
            orderData.put("amount", (int)(payment.getAmount() * 100)); // Convert to paise
            orderData.put("currency", payment.getCurrency());
            orderData.put("receipt", "receipt_" + savedPayment.getId());
            
            Map<String, String> notes = new HashMap<>();
            notes.put("patient_id", payment.getPatientId());
            notes.put("payment_type", payment.getPaymentType());
            notes.put("payment_db_id", savedPayment.getId());
            orderData.put("notes", notes);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBasicAuth(razorpayKeyId, razorpayKeySecret);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(orderData, headers);
            
            // In demo mode, create mock order
            Map<String, Object> mockOrder = createMockRazorpayOrder(orderData);
            
            // Update payment with order ID
            savedPayment.setOrderId((String) mockOrder.get("id"));
            paymentRepository.save(savedPayment);

            // Return order details for frontend
            Map<String, Object> response = new HashMap<>();
            response.put("orderId", mockOrder.get("id"));
            response.put("amount", mockOrder.get("amount"));
            response.put("currency", mockOrder.get("currency"));
            response.put("keyId", razorpayKeyId);
            response.put("paymentDbId", savedPayment.getId());
            response.put("description", payment.getDescription());
            response.put("prefill", createPrefillData(payment));

            return response;

        } catch (Exception e) {
            throw new RuntimeException("Error creating payment order: " + e.getMessage());
        }
    }

    // Verify payment signature
    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;
            String computedSignature = hmacSha256(payload, razorpayKeySecret);
            return computedSignature.equals(signature);
        } catch (Exception e) {
            return false;
        }
    }

    // Update payment status
    public Payment updatePaymentStatus(String paymentDbId, String paymentId, String status, Map<String, Object> paymentDetails) {
        Optional<Payment> optionalPayment = paymentRepository.findById(paymentDbId);
        if (optionalPayment.isPresent()) {
            Payment payment = optionalPayment.get();
            payment.setPaymentId(paymentId);
            payment.setPaymentStatus(status);
            
            if (paymentDetails != null) {
                Payment.PaymentDetails details = new Payment.PaymentDetails();
                details.setBankName((String) paymentDetails.get("bank"));
                details.setCardType((String) paymentDetails.get("card_type"));
                details.setCardLast4((String) paymentDetails.get("last4"));
                details.setUpiId((String) paymentDetails.get("vpa"));
                details.setWalletName((String) paymentDetails.get("wallet"));
                details.setTransactionId((String) paymentDetails.get("acquirer_data"));
                payment.setPaymentDetails(details);
            }

            Payment updatedPayment = paymentRepository.save(payment);
            
            // Distribute payment to doctor/pharmacy wallet after successful payment
            if ("SUCCESS".equals(status)) {
                walletService.distributePayment(updatedPayment);
            }
            
            return updatedPayment;
        }
        throw new RuntimeException("Payment not found with ID: " + paymentDbId);
    }

    // Get patient payments
    public List<Payment> getPatientPayments(String patientId) {
        return paymentRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    // Get payment by ID
    public Payment getPaymentById(String paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    // Generate invoice
    public Map<String, Object> generateInvoice(String paymentId) {
        Payment payment = getPaymentById(paymentId);
        
        Map<String, Object> invoice = new HashMap<>();
        invoice.put("invoiceNumber", payment.getInvoiceNumber());
        invoice.put("paymentId", payment.getPaymentId());
        invoice.put("amount", payment.getAmount());
        invoice.put("currency", payment.getCurrency());
        invoice.put("paymentDate", payment.getUpdatedAt());
        invoice.put("paymentMethod", payment.getPaymentMethod());
        invoice.put("paymentStatus", payment.getPaymentStatus());
        invoice.put("description", payment.getDescription());
        invoice.put("items", payment.getItems());
        
        return invoice;
    }

    // Get payment statistics
    public Map<String, Object> getPaymentStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalPayments", paymentRepository.count());
        stats.put("successfulPayments", paymentRepository.countByPaymentStatus("SUCCESS"));
        stats.put("pendingPayments", paymentRepository.countByPaymentStatus("PENDING"));
        stats.put("failedPayments", paymentRepository.countByPaymentStatus("FAILED"));
        stats.put("consultationPayments", paymentRepository.countByPaymentType("CONSULTATION"));
        stats.put("medicinePayments", paymentRepository.countByPaymentType("MEDICINE"));
        
        // Calculate total revenue
        List<Payment> successfulPayments = paymentRepository.findByPaymentStatusOrderByCreatedAtDesc("SUCCESS");
        double totalRevenue = successfulPayments.stream()
                .mapToDouble(Payment::getAmount)
                .sum();
        stats.put("totalRevenue", totalRevenue);
        
        return stats;
    }

    // Helper methods
    private String generateInvoiceNumber() {
        return "INV-" + System.currentTimeMillis();
    }

    private Map<String, Object> createMockRazorpayOrder(Map<String, Object> orderData) {
        Map<String, Object> order = new HashMap<>();
        order.put("id", "order_" + System.currentTimeMillis());
        order.put("entity", "order");
        order.put("amount", orderData.get("amount"));
        order.put("amount_paid", 0);
        order.put("amount_due", orderData.get("amount"));
        order.put("currency", orderData.get("currency"));
        order.put("receipt", orderData.get("receipt"));
        order.put("status", "created");
        order.put("created_at", System.currentTimeMillis() / 1000);
        order.put("notes", orderData.get("notes"));
        
        return order;
    }

    private Map<String, Object> createPrefillData(Payment payment) {
        Map<String, Object> prefill = new HashMap<>();
        prefill.put("name", "Patient"); // You can get actual patient name from patient service
        prefill.put("email", "patient@healthconnect.com");
        prefill.put("contact", "9999999999");
        
        return prefill;
    }

    private String hmacSha256(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        
        StringBuilder result = new StringBuilder();
        for (byte b : hash) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
}