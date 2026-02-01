package com.happyfarmer.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class ProductDTO {
    private UUID id;
    private String name;
    private String description;
    private String category;
    private BigDecimal price;
    private String unit;
    private Integer stockQuantity;
    private LocalDate harvestDate;
    private String imageUrl;
    private Boolean active;
    private UUID farmerId;
    private String farmerName;
}
