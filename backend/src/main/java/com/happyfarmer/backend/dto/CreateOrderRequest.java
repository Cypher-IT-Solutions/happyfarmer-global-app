package com.happyfarmer.backend.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class CreateOrderRequest {
    private UUID farmerId;
    private List<OrderItemRequest> items;
    private String deliveryAddress;
    private boolean isDelivery;
}
