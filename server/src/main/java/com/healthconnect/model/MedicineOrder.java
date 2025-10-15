package com.healthconnect.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class MedicineOrder {
    @Id
    private String id;
    private String patientId;
    private String patientName;
    private String patientAddress;
    private String patientPhone;
    private List<OrderItem> items;
    private Double totalAmount;
    private String status; // PLACED, PROCESSING, SHIPPED, DELIVERED
    private String orderDate;
    private String deliveryDate;
}
