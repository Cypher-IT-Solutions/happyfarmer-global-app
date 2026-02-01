package com.happyfarmer.backend.repositories;

import com.happyfarmer.backend.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByFarmerId(UUID farmerId);

    List<Product> findByCategory(com.happyfarmer.backend.models.Category category);

    /**
     * Find products from farmers within a specified radius (in kilometers) from a
     * given location.
     * Uses the Haversine formula to calculate distances.
     */
    @org.springframework.data.jpa.repository.Query(value = "SELECT p.* FROM products p " +
            "INNER JOIN farmers f ON p.farmer_id = f.id " +
            "WHERE f.latitude IS NOT NULL AND f.longitude IS NOT NULL AND " +
            "(6371 * acos(cos(radians(:latitude)) * cos(radians(f.latitude)) * " +
            "cos(radians(f.longitude) - radians(:longitude)) + " +
            "sin(radians(:latitude)) * sin(radians(f.latitude)))) <= :radiusKm " +
            "AND p.active = true", nativeQuery = true)
    List<Product> findNearbyProducts(
            @org.springframework.data.repository.query.Param("latitude") double latitude,
            @org.springframework.data.repository.query.Param("longitude") double longitude,
            @org.springframework.data.repository.query.Param("radiusKm") double radiusKm);
}
