package com.happyfarmer.backend.controllers;

import com.happyfarmer.backend.dto.CartItemDTO;
import com.happyfarmer.backend.services.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.getCart(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<CartItemDTO> addToCart(Authentication authentication,
            @RequestBody Map<String, Object> payload) {
        UUID productId = UUID.fromString(payload.get("productId").toString());
        Integer quantity = (Integer) payload.getOrDefault("quantity", 1);
        return ResponseEntity.ok(cartService.addToCart(authentication.getName(), productId, quantity));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<CartItemDTO> updateQuantity(Authentication authentication, @PathVariable UUID productId,
            @RequestBody Map<String, Integer> payload) {
        Integer quantity = payload.get("quantity");
        return ResponseEntity.ok(cartService.updateQuantity(authentication.getName(), productId, quantity));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromCart(Authentication authentication, @PathVariable UUID productId) {
        cartService.removeFromCart(authentication.getName(), productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.ok().build();
    }
}
