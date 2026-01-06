package com.happyfarmer.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class OrderResponse {
    private UUID id;
    private String status;
    private BigDecimal totalAmount;
    private String message;
    private java.time.LocalDateTime createdAt;
    private FarmerDTO farmer;
    private String deliveryAddress;
}
