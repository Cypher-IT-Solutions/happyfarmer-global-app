package com.happyfarmer.backend.models;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AuthResponse {
    private UUID id;
    private String token;
    private String email;
    private String fullName;
    private String role;
    private String message;

    public AuthResponse() {}

    public AuthResponse(UUID id, String token, String email, String fullName, String role, String message) {
        this.id = id;
        this.token = token;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.message = message;
    }

}
