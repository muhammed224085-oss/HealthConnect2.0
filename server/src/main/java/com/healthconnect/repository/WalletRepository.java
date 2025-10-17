package com.healthconnect.repository;

import com.healthconnect.model.Wallet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WalletRepository extends MongoRepository<Wallet, String> {
    
    // Find wallet by owner ID and type
    Optional<Wallet> findByOwnerIdAndOwnerType(String ownerId, String ownerType);
    
    // Find all wallets by owner type
    List<Wallet> findByOwnerType(String ownerType);
    
    // Find wallets by status
    List<Wallet> findByStatus(Wallet.WalletStatus status);
    
    // Find wallets with balance greater than specified amount
    @Query("{'balance': {'$gte': ?0}}")
    List<Wallet> findByBalanceGreaterThanEqual(Double balance);
    
    // Find wallets by owner type and status
    List<Wallet> findByOwnerTypeAndStatus(String ownerType, Wallet.WalletStatus status);
    
    // Find wallets updated after specific date
    List<Wallet> findByUpdatedAtAfter(LocalDateTime date);
    
    // Count wallets by owner type
    long countByOwnerType(String ownerType);
    
    // Get total balance for all active wallets of specific owner type
    @Query(value = "{'ownerType': ?0, 'status': 'ACTIVE'}", fields = "{'balance': 1}")
    List<Wallet> findActiveWalletsByOwnerType(String ownerType);
}