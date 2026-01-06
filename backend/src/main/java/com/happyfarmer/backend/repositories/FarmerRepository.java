package com.happyfarmer.backend.repositories;

import com.happyfarmer.backend.models.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

import com.happyfarmer.backend.models.User;
import java.util.Optional;

@Repository
public interface FarmerRepository extends JpaRepository<Farmer, UUID> {
    Optional<Farmer> findByUser(User user);
}
