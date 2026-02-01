package com.happyfarmer.backend.dto;

import java.util.UUID;
import lombok.Data;

@Data
public class FarmerDTO {
    private UUID id;
    private String farmName;
    private String bio;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private Double latitude;
    private Double longitude;
    private Boolean offersDelivery;
    private Integer deliveryRadiusKm;
    private Double deliveryFeeBase;
    private Boolean offersPickup;
    private String pickupInstructions;
    private String imageUrl;
    private Double averageRating;
    private Integer reviewCount;
}
