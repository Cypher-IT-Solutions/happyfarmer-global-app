package com.happyfarmer.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Entity
@Table(name = "farmers")
@Getter
@Setter
public class Farmer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(nullable = false)
    private String farmName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String contactEmail;
    private String contactPhone;

    // Location for pickup/calculating distance
    private String address;
    private Double latitude;
    private Double longitude;

    // Delivery settings
    private Boolean offersDelivery = false;
    private Integer deliveryRadiusKm;
    private Double deliveryFeeBase;

    private Boolean offersPickup = true;
    private String pickupInstructions;

    private Boolean isVerified = false;
    private String imageUrl;
}
