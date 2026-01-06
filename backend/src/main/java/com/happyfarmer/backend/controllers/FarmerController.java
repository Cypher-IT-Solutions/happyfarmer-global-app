package com.happyfarmer.backend.controllers;

import com.happyfarmer.backend.models.Farmer;
import com.happyfarmer.backend.services.FarmerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/farmers")
@RequiredArgsConstructor
public class FarmerController {

    private final FarmerService farmerService;

    @GetMapping
    public ResponseEntity<List<Farmer>> getAllFarmers() {
        return ResponseEntity.ok(farmerService.getAllFarmers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Farmer> getFarmerById(@PathVariable UUID id) {
        return ResponseEntity.ok(farmerService.getFarmerById(id));
    }

    @PostMapping
    public ResponseEntity<Farmer> createFarmer(@RequestBody Farmer farmer) {
        return ResponseEntity.ok(farmerService.saveFarmer(farmer));
    }

    @PostMapping("/upgrade")
    public ResponseEntity<com.happyfarmer.backend.models.AuthResponse> upgradeToFarmer(
            @RequestBody com.happyfarmer.backend.dto.FarmerDTO dto) {
        String userEmail = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return ResponseEntity.ok(farmerService.upgradeToFarmer(dto, userEmail));
    }
}
