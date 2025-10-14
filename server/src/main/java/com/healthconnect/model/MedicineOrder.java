package com.healthconnect.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicineOrder {
    private Long id;
    private Long patientId;
    private String patientName;
    private String patientAddress;
    private String patientPhone;
    private List<OrderItem> items;
    private Double totalAmount;
    private String status; // PLACED, PROCESSING, SHIPPED, DELIVERED
    private String orderDate;
    private String deliveryDate;
}
