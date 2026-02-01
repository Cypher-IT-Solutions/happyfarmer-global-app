package com.happyfarmer.backend.controllers;

import com.happyfarmer.backend.models.Product;
import com.happyfarmer.backend.services.ProductService;
import com.happyfarmer.backend.services.SupabaseStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final SupabaseStorageService storageService;

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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> createProduct(
            @RequestPart("product") com.happyfarmer.backend.dto.ProductDTO productDTO,
            @RequestPart(value = "image", required = false) MultipartFile image)
            throws IOException {
        String userEmail = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();

        if (image != null && !image.isEmpty()) {
            String imageUrl = storageService.uploadFile(image, "product-images");
            productDTO.setImageUrl(imageUrl);
        }

        return ResponseEntity.ok(productService.addProduct(productDTO, userEmail));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> updateProduct(
            @PathVariable UUID id,
            @RequestPart("product") com.happyfarmer.backend.dto.ProductDTO productDTO,
            @RequestPart(value = "image", required = false) MultipartFile image)
            throws IOException {
        String userEmail = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();

        if (image != null && !image.isEmpty()) {
            String imageUrl = storageService.uploadFile(image, "product-images");
            productDTO.setImageUrl(imageUrl);
        }

        return ResponseEntity.ok(productService.updateProduct(id, productDTO, userEmail));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable UUID id) {
        String userEmail = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        productService.deleteProduct(id, userEmail);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<com.happyfarmer.backend.dto.ProductDTO>> getNearbyProducts(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "50") double radius) {
        return ResponseEntity.ok(productService.getNearbyProducts(lat, lng, radius));
    }
}
