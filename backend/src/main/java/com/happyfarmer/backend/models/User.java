package com.happyfarmer.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_favorites", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "product_id"))
    private java.util.Set<Product> favorites = new java.util.HashSet<>();

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    private String fullName;
    private String phoneNumber;

    @Column(nullable = false)
    private String role;

    private String profileImageUrl;
    private String address;
    private Double latitude;
    private Double longitude;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();
    private Boolean isActive = true;
    private LocalDateTime lastLoginAt;

}
