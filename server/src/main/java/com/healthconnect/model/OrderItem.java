package com.healthconnect.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private String medicineId;
    private String medicineName;
    private String name; // Alternative field for medicine name
    private Integer quantity;
    private Double price;
}
