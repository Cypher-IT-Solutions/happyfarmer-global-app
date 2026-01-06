package com.happyfarmer.backend.repositories;

import com.happyfarmer.backend.models.CartItem;
import com.happyfarmer.backend.models.User;
import com.happyfarmer.backend.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndProduct(User user, Product product);

    void deleteByUser(User user);
}
