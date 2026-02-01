package com.happyfarmer.backend.services;

import com.happyfarmer.backend.models.AuthResponse;
import com.happyfarmer.backend.models.Farmer;
import com.happyfarmer.backend.models.User;
import com.happyfarmer.backend.repositories.FarmerRepository;
import com.happyfarmer.backend.repositories.UserRepository;
import com.happyfarmer.backend.dto.FarmerDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FarmerService {
    private final FarmerRepository farmerRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final ReviewService reviewService;

    public List<FarmerDTO> getAllFarmers() {
        return farmerRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public FarmerDTO mapToDTO(Farmer farmer) {
        FarmerDTO dto = new FarmerDTO();
        dto.setId(farmer.getId());
        dto.setFarmName(farmer.getFarmName());
        dto.setBio(farmer.getBio());
        dto.setContactEmail(farmer.getContactEmail());
        dto.setContactPhone(farmer.getContactPhone());
        dto.setAddress(farmer.getAddress());
        dto.setLatitude(farmer.getLatitude());
        dto.setLongitude(farmer.getLongitude());
        dto.setOffersDelivery(farmer.getOffersDelivery());
        dto.setDeliveryRadiusKm(farmer.getDeliveryRadiusKm());
        dto.setDeliveryFeeBase(farmer.getDeliveryFeeBase());
        dto.setOffersPickup(farmer.getOffersPickup());
        dto.setPickupInstructions(farmer.getPickupInstructions());
        dto.setImageUrl(farmer.getImageUrl());

        // Add review stats
        dto.setAverageRating(reviewService.getAverageRating(farmer.getId()));
        dto.setReviewCount(reviewService.getReviewsByFarmer(farmer.getId()).size());

        return dto;
    }

    public AuthResponse upgradeToFarmer(FarmerDTO dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("FARMER".equals(user.getRole())) {
            throw new RuntimeException("User is already a farmer");
        }

        // 1. Update User Role
        user.setRole("FARMER");
        userRepository.save(user);

        // 2. Create Farmer Profile
        Farmer farmer = new Farmer();
        farmer.setUser(user);
        farmer.setFarmName(dto.getFarmName());
        farmer.setBio(dto.getBio());
        farmer.setContactEmail(dto.getContactEmail());
        farmer.setContactPhone(dto.getContactPhone());
        farmer.setAddress(dto.getAddress());

        // Set coordinates if provided, otherwise geocode the address
        if (dto.getLatitude() != null && dto.getLongitude() != null) {
            farmer.setLatitude(dto.getLatitude());
            farmer.setLongitude(dto.getLongitude());
        } else if (dto.getAddress() != null && !dto.getAddress().trim().isEmpty()) {
            // Fallback to geocoding if coordinates not provided
            GeocodingService geocodingService = new GeocodingService();
            double[] coords = geocodingService.geocodeAddress(dto.getAddress());
            if (coords != null) {
                farmer.setLatitude(coords[0]);
                farmer.setLongitude(coords[1]);
            }
        }

        farmer.setOffersDelivery(dto.getOffersDelivery() != null ? dto.getOffersDelivery() : false);
        farmer.setDeliveryRadiusKm(dto.getDeliveryRadiusKm());
        farmer.setDeliveryFeeBase(dto.getDeliveryFeeBase());
        farmer.setOffersPickup(dto.getOffersPickup() != null ? dto.getOffersPickup() : true);
        farmer.setPickupInstructions(dto.getPickupInstructions());

        farmerRepository.save(farmer);

        // 3. Generate New Token with new role
        String token = jwtService.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(
                user.getId(),
                token,
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                "Successfully upgraded to Farmer profile!");
    }

    public Farmer getFarmerById(UUID id) {
        return farmerRepository.findById(id).orElseThrow(() -> new RuntimeException("Farmer not found"));
    }

    public FarmerDTO getFarmerDTOById(UUID id) {
        return mapToDTO(getFarmerById(id));
    }

    public Farmer saveFarmer(Farmer farmer) {
        return farmerRepository.save(farmer);
    }

    public Farmer updateProfileImage(String userEmail, String imageUrl) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Farmer farmer = farmerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Farmer profile not found"));
        farmer.setImageUrl(imageUrl);
        return farmerRepository.save(farmer);
    }

    public List<Farmer> getNearbyFarmers(double latitude, double longitude, double radiusKm) {
        return farmerRepository.findNearbyFarmers(latitude, longitude, radiusKm);
    }

    public List<FarmerDTO> getNearbyFarmerDTOs(double latitude, double longitude, double radiusKm) {
        return getNearbyFarmers(latitude, longitude, radiusKm).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}
