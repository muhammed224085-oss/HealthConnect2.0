package com.healthconnect.repository;

import com.healthconnect.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    
    // Find payments by patient ID
    List<Payment> findByPatientIdOrderByCreatedAtDesc(String patientId);
    
    // Find payments by doctor ID (for consultation payments)
    List<Payment> findByDoctorIdOrderByCreatedAtDesc(String doctorId);
    
    // Find payments by payment status
    List<Payment> findByPaymentStatusOrderByCreatedAtDesc(String paymentStatus);
    
    // Find payments by payment type
    List<Payment> findByPaymentTypeOrderByCreatedAtDesc(String paymentType);
    
    // Find payment by Razorpay order ID
    Optional<Payment> findByOrderId(String orderId);
    
    // Find payment by Razorpay payment ID
    Optional<Payment> findByPaymentId(String paymentId);
    
    // Find payments by medicine order ID
    List<Payment> findByMedicineOrderId(String medicineOrderId);
    
    // Find payments by date range
    @Query("{'createdAt': {'$gte': ?0, '$lte': ?1}}")
    List<Payment> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find successful payments by patient
    @Query("{'patientId': ?0, 'paymentStatus': 'SUCCESS'}")
    List<Payment> findSuccessfulPaymentsByPatient(String patientId);
    
    // Find failed payments for retry
    @Query("{'paymentStatus': 'FAILED', 'createdAt': {'$gte': ?0}}")
    List<Payment> findFailedPaymentsSince(LocalDateTime since);
    
    // Get total revenue by date range
    @Query(value = "{'paymentStatus': 'SUCCESS', 'createdAt': {'$gte': ?0, '$lte': ?1}}", 
           fields = "{'amount': 1}")
    List<Payment> findSuccessfulPaymentsByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find payments by invoice number
    Optional<Payment> findByInvoiceNumber(String invoiceNumber);
    
    // Count payments by status
    long countByPaymentStatus(String paymentStatus);
    
    // Count payments by type
    long countByPaymentType(String paymentType);
}