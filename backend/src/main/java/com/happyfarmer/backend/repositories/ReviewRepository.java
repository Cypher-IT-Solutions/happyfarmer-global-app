package com.happyfarmer.backend.repositories;

import com.happyfarmer.backend.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByFarmerIdOrderByCreatedAtDesc(UUID farmerId);
}
