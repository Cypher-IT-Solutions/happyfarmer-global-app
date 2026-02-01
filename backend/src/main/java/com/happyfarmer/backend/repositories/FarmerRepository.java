package com.happyfarmer.backend.repositories;

import com.happyfarmer.backend.models.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

import com.happyfarmer.backend.models.User;
import java.util.List;
import java.util.Optional;

@Repository
public interface FarmerRepository extends JpaRepository<Farmer, UUID> {
    Optional<Farmer> findByUser(User user);

    /**
     * Find farmers within a specified radius (in kilometers) from a given location.
     * Uses the Haversine formula to calculate distances.
     * 
     * @param latitude  User's latitude
     * @param longitude User's longitude
     * @param radiusKm  Search radius in kilometers
     * @return List of farmers within the radius
     */
    @org.springframework.data.jpa.repository.Query(value = "SELECT * FROM farmers f WHERE " +
            "f.latitude IS NOT NULL AND f.longitude IS NOT NULL AND " +
            "(6371 * acos(cos(radians(:latitude)) * cos(radians(f.latitude)) * " +
            "cos(radians(f.longitude) - radians(:longitude)) + " +
            "sin(radians(:latitude)) * sin(radians(f.latitude)))) <= :radiusKm", nativeQuery = true)
    List<Farmer> findNearbyFarmers(
            @org.springframework.data.repository.query.Param("latitude") double latitude,
            @org.springframework.data.repository.query.Param("longitude") double longitude,
            @org.springframework.data.repository.query.Param("radiusKm") double radiusKm);
}
