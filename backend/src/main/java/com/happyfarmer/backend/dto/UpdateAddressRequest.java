package com.happyfarmer.backend.dto;

import lombok.Data;

@Data
public class UpdateAddressRequest {
    private String address;
    private Double latitude;
    private Double longitude;
}
