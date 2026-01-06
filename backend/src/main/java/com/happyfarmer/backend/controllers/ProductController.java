package com.happyfarmer.backend.controllers;

import com.happyfarmer.backend.models.Product;
import com.happyfarmer.backend.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<com.happyfarmer.backend.dto.ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<com.happyfarmer.backend.dto.ProductDTO>> getProductsByFarmer(
            @PathVariable UUID farmerId) {
        return ResponseEntity.ok(productService.getProductsByFarmer(farmerId));
    }

    @GetMapping("/my-products")
    public ResponseEntity<List<com.happyfarmer.backend.dto.ProductDTO>> getMyProducts() {
        String userEmail = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return ResponseEntity.ok(productService.getProductsByUser(userEmail));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody com.happyfarmer.backend.dto.ProductDTO productDTO) {
        String userEmail = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return ResponseEntity.ok(productService.addProduct(productDTO, userEmail));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable UUID id,
            @RequestBody com.happyfarmer.backend.dto.ProductDTO productDTO) {
        String userEmail = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return ResponseEntity.ok(productService.updateProduct(id, productDTO, userEmail));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable UUID id) {
        String userEmail = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        productService.deleteProduct(id, userEmail);
        return ResponseEntity.ok().build();
    }
}
