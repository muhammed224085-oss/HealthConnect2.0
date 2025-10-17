package com.healthconnect.service;

import com.healthconnect.model.Wallet;
import com.healthconnect.model.Payment;
import com.healthconnect.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    // Create or get wallet for doctor/pharmacy
    public Wallet getOrCreateWallet(String ownerId, String ownerType) {
        Optional<Wallet> existingWallet = walletRepository.findByOwnerIdAndOwnerType(ownerId, ownerType);
        
        if (existingWallet.isPresent()) {
            return existingWallet.get();
        } else {
            Wallet newWallet = new Wallet(ownerId, ownerType);
            return walletRepository.save(newWallet);
        }
    }

    // Process payment distribution after successful payment
    public void distributePayment(Payment payment) {
        try {
            if ("SUCCESS".equals(payment.getPaymentStatus())) {
                if ("CONSULTATION".equals(payment.getPaymentType())) {
                    // Credit consultation fee to doctor's wallet
                    creditDoctorWallet(payment);
                } else if ("MEDICINE".equals(payment.getPaymentType())) {
                    // Credit medicine payment to pharmacy wallet
                    creditPharmacyWallet(payment);
                }
            }
        } catch (Exception e) {
            System.err.println("Error distributing payment: " + e.getMessage());
            // In production, implement proper error handling and retry mechanism
        }
    }

    // Credit consultation fee to doctor's wallet
    private void creditDoctorWallet(Payment payment) {
        if (payment.getDoctorId() != null) {
            Wallet doctorWallet = getOrCreateWallet(payment.getDoctorId(), "DOCTOR");
            
            // Calculate doctor's share (80% of consultation fee, 20% platform commission)
            Double platformCommission = payment.getAmount() * 0.20; // 20% platform fee
            Double doctorShare = payment.getAmount() - platformCommission;
            
            // Create transaction for doctor's credit
            Wallet.Transaction doctorTransaction = new Wallet.Transaction(
                payment.getPaymentId(),
                Wallet.TransactionType.CREDIT,
                doctorShare,
                "Consultation fee from patient - Payment ID: " + payment.getPaymentId()
            );
            doctorTransaction.setRelatedEntityId(payment.getPatientId());
            
            doctorWallet.addTransaction(doctorTransaction);
            walletRepository.save(doctorWallet);
            
            // Log platform commission (in production, this would go to platform wallet)
            System.out.println("Platform commission: ₹" + platformCommission + " for payment: " + payment.getPaymentId());
        }
    }

    // Credit medicine payment to pharmacy wallet
    private void creditPharmacyWallet(Payment payment) {
        // For demo, we'll use a default pharmacy ID
        // In production, this would be determined by which pharmacy fulfills the order
        String pharmacyId = "pharmacy_001"; // Default pharmacy
        
        Wallet pharmacyWallet = getOrCreateWallet(pharmacyId, "PHARMACY");
        
        // Calculate pharmacy's share (90% of medicine cost, 10% platform commission)
        Double platformCommission = payment.getAmount() * 0.10; // 10% platform fee
        Double pharmacyShare = payment.getAmount() - platformCommission;
        
        // Create transaction for pharmacy's credit
        Wallet.Transaction pharmacyTransaction = new Wallet.Transaction(
            payment.getPaymentId(),
            Wallet.TransactionType.CREDIT,
            pharmacyShare,
            "Medicine order payment - Order ID: " + payment.getMedicineOrderId()
        );
        pharmacyTransaction.setRelatedEntityId(payment.getPatientId());
        
        pharmacyWallet.addTransaction(pharmacyTransaction);
        walletRepository.save(pharmacyWallet);
        
        // Log platform commission
        System.out.println("Platform commission: ₹" + platformCommission + " for medicine order: " + payment.getMedicineOrderId());
    }

    // Get wallet balance
    public Double getWalletBalance(String ownerId, String ownerType) {
        Optional<Wallet> wallet = walletRepository.findByOwnerIdAndOwnerType(ownerId, ownerType);
        return wallet.map(Wallet::getBalance).orElse(0.0);
    }

    // Get wallet by owner
    public Wallet getWallet(String ownerId, String ownerType) {
        return walletRepository.findByOwnerIdAndOwnerType(ownerId, ownerType).orElse(null);
    }

    // Get all doctor wallets
    public List<Wallet> getAllDoctorWallets() {
        return walletRepository.findByOwnerType("DOCTOR");
    }

    // Get all pharmacy wallets
    public List<Wallet> getAllPharmacyWallets() {
        return walletRepository.findByOwnerType("PHARMACY");
    }

    // Process withdrawal request
    public boolean processWithdrawal(String ownerId, String ownerType, Double amount, String bankDetails) {
        Optional<Wallet> walletOpt = walletRepository.findByOwnerIdAndOwnerType(ownerId, ownerType);
        
        if (walletOpt.isPresent()) {
            Wallet wallet = walletOpt.get();
            
            if (wallet.hasSufficientBalance(amount) && amount > 0) {
                // Create withdrawal transaction
                Wallet.Transaction withdrawalTransaction = new Wallet.Transaction(
                    "withdrawal_" + System.currentTimeMillis(),
                    Wallet.TransactionType.WITHDRAWAL,
                    amount,
                    "Withdrawal to bank account: " + bankDetails
                );
                
                wallet.addTransaction(withdrawalTransaction);
                walletRepository.save(wallet);
                
                // In production, integrate with banking API for actual transfer
                System.out.println("Withdrawal processed: ₹" + amount + " for " + ownerType + ": " + ownerId);
                return true;
            }
        }
        return false;
    }

    // Get wallet statistics
    public WalletStatistics getWalletStatistics() {
        List<Wallet> doctorWallets = getAllDoctorWallets();
        List<Wallet> pharmacyWallets = getAllPharmacyWallets();
        
        Double totalDoctorBalance = doctorWallets.stream()
            .mapToDouble(Wallet::getBalance)
            .sum();
            
        Double totalPharmacyBalance = pharmacyWallets.stream()
            .mapToDouble(Wallet::getBalance)
            .sum();
        
        return new WalletStatistics(
            doctorWallets.size(),
            pharmacyWallets.size(),
            totalDoctorBalance,
            totalPharmacyBalance,
            totalDoctorBalance + totalPharmacyBalance
        );
    }

    // Statistics class
    public static class WalletStatistics {
        private final int totalDoctorWallets;
        private final int totalPharmacyWallets;
        private final Double totalDoctorBalance;
        private final Double totalPharmacyBalance;
        private final Double totalBalance;

        public WalletStatistics(int totalDoctorWallets, int totalPharmacyWallets, 
                              Double totalDoctorBalance, Double totalPharmacyBalance, 
                              Double totalBalance) {
            this.totalDoctorWallets = totalDoctorWallets;
            this.totalPharmacyWallets = totalPharmacyWallets;
            this.totalDoctorBalance = totalDoctorBalance;
            this.totalPharmacyBalance = totalPharmacyBalance;
            this.totalBalance = totalBalance;
        }

        // Getters
        public int getTotalDoctorWallets() { return totalDoctorWallets; }
        public int getTotalPharmacyWallets() { return totalPharmacyWallets; }
        public Double getTotalDoctorBalance() { return totalDoctorBalance; }
        public Double getTotalPharmacyBalance() { return totalPharmacyBalance; }
        public Double getTotalBalance() { return totalBalance; }
    }
}