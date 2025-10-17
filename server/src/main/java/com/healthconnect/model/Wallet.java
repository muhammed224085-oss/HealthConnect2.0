package com.healthconnect.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "wallets")
public class Wallet {
    @Id
    private String id;
    private String ownerId; // doctorId or pharmacyId
    private String ownerType; // "DOCTOR", "PHARMACY"
    private Double balance;
    private String currency;
    private List<Transaction> transactions;
    private WalletStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public Wallet() {
        this.balance = 0.0;
        this.currency = "INR";
        this.transactions = new ArrayList<>();
        this.status = WalletStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Wallet(String ownerId, String ownerType) {
        this();
        this.ownerId = ownerId;
        this.ownerType = ownerType;
    }

    // Methods
    public void addTransaction(Transaction transaction) {
        if (this.transactions == null) {
            this.transactions = new ArrayList<>();
        }
        this.transactions.add(transaction);
        
        // Update balance based on transaction type
        if (transaction.getType() == TransactionType.CREDIT) {
            this.balance += transaction.getAmount();
        } else if (transaction.getType() == TransactionType.DEBIT) {
            this.balance -= transaction.getAmount();
        }
        
        this.updatedAt = LocalDateTime.now();
    }

    public boolean hasSufficientBalance(Double amount) {
        return this.balance >= amount;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }

    public String getOwnerType() { return ownerType; }
    public void setOwnerType(String ownerType) { this.ownerType = ownerType; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { 
        this.balance = balance;
        this.updatedAt = LocalDateTime.now();
    }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public List<Transaction> getTransactions() { return transactions; }
    public void setTransactions(List<Transaction> transactions) { this.transactions = transactions; }

    public WalletStatus getStatus() { return status; }
    public void setStatus(WalletStatus status) { 
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Inner classes
    public static class Transaction {
        private String id;
        private String paymentId;
        private TransactionType type;
        private Double amount;
        private String description;
        private LocalDateTime createdAt;
        private String relatedEntityId; // patientId, orderId, etc.

        public Transaction() {
            this.id = "txn_" + System.currentTimeMillis();
            this.createdAt = LocalDateTime.now();
        }

        public Transaction(String paymentId, TransactionType type, Double amount, String description) {
            this();
            this.paymentId = paymentId;
            this.type = type;
            this.amount = amount;
            this.description = description;
        }

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getPaymentId() { return paymentId; }
        public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

        public TransactionType getType() { return type; }
        public void setType(TransactionType type) { this.type = type; }

        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public String getRelatedEntityId() { return relatedEntityId; }
        public void setRelatedEntityId(String relatedEntityId) { this.relatedEntityId = relatedEntityId; }
    }

    // Enums
    public enum WalletStatus {
        ACTIVE, SUSPENDED, FROZEN, CLOSED
    }

    public enum TransactionType {
        CREDIT, DEBIT, REFUND, WITHDRAWAL, COMMISSION
    }
}