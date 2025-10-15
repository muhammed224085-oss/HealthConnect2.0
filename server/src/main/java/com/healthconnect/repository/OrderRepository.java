package com.healthconnect.repository;

import com.healthconnect.model.MedicineOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<MedicineOrder, String> {
    List<MedicineOrder> findByPatientId(String patientId);
    List<MedicineOrder> findByStatus(String status);
}
