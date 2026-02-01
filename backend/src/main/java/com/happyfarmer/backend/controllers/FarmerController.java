package com.happyfarmer.backend.controllers;

import com.happyfarmer.backend.models.Farmer;
import com.happyfarmer.backend.services.FarmerService;
import com.happyfarmer.backend.services.SupabaseStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/farmers")
@RequiredArgsConstructor
public class FarmerController {

    private final FarmerService farmerService;
    private final SupabaseStorageService storageService;

    @GetMapping
    public ResponseEntity<List<com.happyfarmer.backend.dto.FarmerDTO>> getAllFarmers() {
        return ResponseEntity.ok(farmerService.getAllFarmers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<com.happyfarmer.backend.dto.FarmerDTO> getFarmerById(@PathVariable UUID id) {
        return ResponseEntity.ok(farmerService.getFarmerDTOById(id));
    }

    @PostMapping
    public ResponseEntity<Farmer> createFarmer(@RequestBody Farmer farmer) {
        return ResponseEntity.ok(farmerService.saveFarmer(farmer));
    }

    @PostMapping(value = "/upgrade", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<com.happyfarmer.backend.models.AuthResponse> upgradeToFarmer(
            @RequestPart("farmer") com.happyfarmer.backend.dto.FarmerDTO dto,
            @RequestPart(value = "image", required = false) MultipartFile image)
            throws IOException {
        String userEmail = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();

        if (image != null && !image.isEmpty()) {
            String imageUrl = storageService.uploadFile(image, "profile-images");
            dto.setImageUrl(imageUrl);
        }

        return ResponseEntity.ok(farmerService.upgradeToFarmer(dto, userEmail));
    }

    @PostMapping(value = "/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Farmer> updateProfileImage(
            @RequestPart("image") MultipartFile image) throws IOException {
        String userEmail = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        String imageUrl = storageService.uploadFile(image, "profile-images");
        return ResponseEntity.ok(farmerService.updateProfileImage(userEmail, imageUrl));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<com.happyfarmer.backend.dto.FarmerDTO>> getNearbyFarmers(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "50") double radius) {
        return ResponseEntity.ok(farmerService.getNearbyFarmerDTOs(lat, lng, radius));
    }
}
