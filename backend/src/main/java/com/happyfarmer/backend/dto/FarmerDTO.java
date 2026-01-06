package com.happyfarmer.backend.dto;

import lombok.Data;

@Data
public class FarmerDTO {
    private String farmName;
    private String bio;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private Boolean offersDelivery;
    private Integer deliveryRadiusKm;
    private Double deliveryFeeBase;
    private Boolean offersPickup;
    private String pickupInstructions;
}
