package com.happyfarmer.backend.services;

import com.happyfarmer.backend.models.AuthResponse;
import com.happyfarmer.backend.models.LoginRequest;
import com.happyfarmer.backend.models.RegisterRequest;
import com.happyfarmer.backend.models.User;
import com.happyfarmer.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public AuthResponse register(RegisterRequest request){

        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(request.getRole());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(user.getId(),token, user.getEmail(), user.getFullName(), user.getRole(),"Registration Successful");

    }

    public AuthResponse login(LoginRequest request){
        // Find user by email

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));

        if(!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())){
            throw new RuntimeException("Invalid password");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(user.getId(),token, user.getEmail(), user.getFullName(), user.getRole(),"Login Successful");
    }
}
