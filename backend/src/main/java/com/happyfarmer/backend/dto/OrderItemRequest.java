package com.happyfarmer.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class OrderItemRequest {
    private UUID productId;
    private int quantity;
}
