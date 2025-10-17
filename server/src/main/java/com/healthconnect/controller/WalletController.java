package com.healthconnect.controller;

import com.healthconnect.model.Wallet;
import com.healthconnect.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wallets")
@CrossOrigin(origins = "*")
public class WalletController {

    @Autowired
    private WalletService walletService;

    // Get wallet for doctor/pharmacy
    @GetMapping("/{ownerType}/{ownerId}")
    public ResponseEntity<Wallet> getWallet(@PathVariable String ownerType, @PathVariable String ownerId) {
        try {
            Wallet wallet = walletService.getOrCreateWallet(ownerId, ownerType.toUpperCase());
            return ResponseEntity.ok(wallet);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get wallet balance
    @GetMapping("/{ownerType}/{ownerId}/balance")
    public ResponseEntity<Map<String, Object>> getWalletBalance(@PathVariable String ownerType, @PathVariable String ownerId) {
        try {
            Double balance = walletService.getWalletBalance(ownerId, ownerType.toUpperCase());
            return ResponseEntity.ok(Map.of(
                "ownerId", ownerId,
                "ownerType", ownerType.toUpperCase(),
                "balance", balance,
                "currency", "INR"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get all doctor wallets (admin only)
    @GetMapping("/doctors")
    public ResponseEntity<List<Wallet>> getAllDoctorWallets() {
        try {
            List<Wallet> wallets = walletService.getAllDoctorWallets();
            return ResponseEntity.ok(wallets);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get all pharmacy wallets (admin only)
    @GetMapping("/pharmacies")
    public ResponseEntity<List<Wallet>> getAllPharmacyWallets() {
        try {
            List<Wallet> wallets = walletService.getAllPharmacyWallets();
            return ResponseEntity.ok(wallets);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Process withdrawal request
    @PostMapping("/{ownerType}/{ownerId}/withdraw")
    public ResponseEntity<Map<String, Object>> processWithdrawal(
            @PathVariable String ownerType,
            @PathVariable String ownerId,
            @RequestBody Map<String, Object> withdrawalRequest) {
        try {
            Double amount = Double.valueOf(withdrawalRequest.get("amount").toString());
            String bankDetails = (String) withdrawalRequest.get("bankDetails");

            boolean success = walletService.processWithdrawal(ownerId, ownerType.toUpperCase(), amount, bankDetails);

            if (success) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Withdrawal request processed successfully",
                    "amount", amount,
                    "bankDetails", bankDetails
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Insufficient balance or invalid withdrawal amount"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    // Get wallet statistics (admin only)
    @GetMapping("/statistics")
    public ResponseEntity<WalletService.WalletStatistics> getWalletStatistics() {
        try {
            WalletService.WalletStatistics stats = walletService.getWalletStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Create demo wallets for testing
    @PostMapping("/demo/create")
    public ResponseEntity<Map<String, Object>> createDemoWallets() {
        try {
            // Create demo doctor wallets
            Wallet doctorWallet1 = walletService.getOrCreateWallet("doctor_001", "DOCTOR");
            Wallet doctorWallet2 = walletService.getOrCreateWallet("doctor_002", "DOCTOR");
            
            // Create demo pharmacy wallet
            Wallet pharmacyWallet = walletService.getOrCreateWallet("pharmacy_001", "PHARMACY");

            return ResponseEntity.ok(Map.of(
                "message", "Demo wallets created successfully",
                "doctorWallets", List.of(doctorWallet1.getId(), doctorWallet2.getId()),
                "pharmacyWallets", List.of(pharmacyWallet.getId())
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get earnings summary for doctor
    @GetMapping("/doctor/{doctorId}/earnings")
    public ResponseEntity<Map<String, Object>> getDoctorEarnings(@PathVariable String doctorId) {
        try {
            Wallet wallet = walletService.getWallet(doctorId, "DOCTOR");
            if (wallet != null) {
                // Calculate total earnings and transaction count
                long totalTransactions = wallet.getTransactions() != null ? wallet.getTransactions().size() : 0;
                double totalEarnings = wallet.getBalance();

                return ResponseEntity.ok(Map.of(
                    "doctorId", doctorId,
                    "currentBalance", wallet.getBalance(),
                    "totalEarnings", totalEarnings,
                    "totalTransactions", totalTransactions,
                    "currency", wallet.getCurrency(),
                    "walletStatus", wallet.getStatus().toString(),
                    "lastUpdated", wallet.getUpdatedAt()
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "doctorId", doctorId,
                    "currentBalance", 0.0,
                    "totalEarnings", 0.0,
                    "totalTransactions", 0,
                    "currency", "INR",
                    "message", "No wallet found, will be created on first payment"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get earnings summary for pharmacy
    @GetMapping("/pharmacy/{pharmacyId}/earnings")
    public ResponseEntity<Map<String, Object>> getPharmacyEarnings(@PathVariable String pharmacyId) {
        try {
            Wallet wallet = walletService.getWallet(pharmacyId, "PHARMACY");
            if (wallet != null) {
                long totalTransactions = wallet.getTransactions() != null ? wallet.getTransactions().size() : 0;
                double totalEarnings = wallet.getBalance();

                return ResponseEntity.ok(Map.of(
                    "pharmacyId", pharmacyId,
                    "currentBalance", wallet.getBalance(),
                    "totalEarnings", totalEarnings,
                    "totalTransactions", totalTransactions,
                    "currency", wallet.getCurrency(),
                    "walletStatus", wallet.getStatus().toString(),
                    "lastUpdated", wallet.getUpdatedAt()
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "pharmacyId", pharmacyId,
                    "currentBalance", 0.0,
                    "totalEarnings", 0.0,
                    "totalTransactions", 0,
                    "currency", "INR",
                    "message", "No wallet found, will be created on first payment"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}