package com.healthconnect.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Medicine {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String category;
    private Integer stock;
}
