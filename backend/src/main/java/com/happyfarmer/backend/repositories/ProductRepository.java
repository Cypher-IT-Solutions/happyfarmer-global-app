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
}
