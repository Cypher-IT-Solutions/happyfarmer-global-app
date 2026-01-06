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

@Service
@RequiredArgsConstructor
public class FarmerService {
    private final FarmerRepository farmerRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public List<Farmer> getAllFarmers() {
        return farmerRepository.findAll();
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
        farmer.setOffersDelivery(dto.getOffersDelivery() != null ? dto.getOffersDelivery() : false);
        farmer.setDeliveryRadiusKm(dto.getDeliveryRadiusKm());
        farmer.setDeliveryFeeBase(dto.getDeliveryFeeBase());
        farmer.setOffersPickup(dto.getOffersPickup() != null ? dto.getOffersPickup() : true);
        farmer.setPickupInstructions(dto.getPickupInstructions());

        farmerRepository.save(farmer);

        // 3. Generate New Token with new role
        String token = jwtService.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                "Successfully upgraded to Farmer profile!");
    }

    public Farmer getFarmerById(UUID id) {
        return farmerRepository.findById(id).orElseThrow(() -> new RuntimeException("Farmer not found"));
    }

    public Farmer saveFarmer(Farmer farmer) {
        return farmerRepository.save(farmer);
    }
}
