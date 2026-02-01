package com.happyfarmer.backend.services;

import com.happyfarmer.backend.models.Product;
import com.happyfarmer.backend.models.User;
import com.happyfarmer.backend.models.Farmer;
import com.happyfarmer.backend.models.Category;
import com.happyfarmer.backend.dto.ProductDTO;
import com.happyfarmer.backend.repositories.ProductRepository;
import com.happyfarmer.backend.repositories.UserRepository;
import com.happyfarmer.backend.repositories.FarmerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final FarmerRepository farmerRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream().map(this::mapToDTO).toList();
    }

    public List<ProductDTO> getProductsByFarmer(UUID farmerId) {
        return productRepository.findByFarmerId(farmerId).stream().map(this::mapToDTO).toList();
    }

    public List<ProductDTO> getProductsByUser(String userEmail) {
        System.out.println("Fetching products for user: " + userEmail);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("User found: " + user.getId());

        Farmer farmer = farmerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Farmer profile not found"));
        System.out.println("Farmer found: " + farmer.getId() + " for user: " + user.getEmail());

        List<Product> products = productRepository.findByFarmerId(farmer.getId());
        System.out.println("Found " + products.size() + " products for farmer " + farmer.getId());
        return products.stream().map(this::mapToDTO).toList();
    }

    public Product getProductById(UUID id) {
        if (id == null)
            throw new IllegalArgumentException("Product ID cannot be null");
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    private ProductDTO mapToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setCategory(product.getCategory().name());
        dto.setPrice(product.getPrice());
        dto.setUnit(product.getUnit());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setHarvestDate(product.getHarvestDate());
        dto.setImageUrl(product.getImageUrl());
        dto.setActive(product.getActive());
        if (product.getFarmer() != null) {
            dto.setFarmerId(product.getFarmer().getId());
            dto.setFarmerName(product.getFarmer().getFarmName() != null ? product.getFarmer().getFarmName()
                    : product.getFarmer().getUser().getFullName());
        }
        return dto;
    }

    public List<ProductDTO> getNearbyProducts(double latitude, double longitude, double radiusKm) {
        return productRepository.findNearbyProducts(latitude, longitude, radiusKm)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public Product addProduct(ProductDTO dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Farmer farmer = farmerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Farmer profile not found"));

        Product product = new Product();
        product.setFarmer(farmer);
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setCategory(Category.valueOf(dto.getCategory().toUpperCase()));
        product.setPrice(dto.getPrice());
        product.setUnit(dto.getUnit());
        product.setStockQuantity(dto.getStockQuantity());
        product.setImageUrl(dto.getImageUrl());
        product.setActive(true);
        if (dto.getHarvestDate() != null)
            product.setHarvestDate(dto.getHarvestDate());

        return productRepository.save(product);
    }

    public Product updateProduct(UUID id, ProductDTO dto, String userEmail) {
        Product product = getProductById(id);

        // Security check: Ensure the authenticated user owns this product
        if (!product.getFarmer().getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized: You do not own this product");
        }

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        if (dto.getCategory() != null)
            product.setCategory(Category.valueOf(dto.getCategory().toUpperCase()));
        product.setPrice(dto.getPrice());
        product.setUnit(dto.getUnit());
        product.setStockQuantity(dto.getStockQuantity());
        product.setImageUrl(dto.getImageUrl());
        if (dto.getHarvestDate() != null)
            product.setHarvestDate(dto.getHarvestDate());
        if (dto.getActive() != null)
            product.setActive(dto.getActive());

        return productRepository.save(product);
    }

    public void deleteProduct(UUID id, String userEmail) {
        Product product = getProductById(id);
        if (!product.getFarmer().getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized: You do not own this product");
        }
        productRepository.delete(product);
    }
}
