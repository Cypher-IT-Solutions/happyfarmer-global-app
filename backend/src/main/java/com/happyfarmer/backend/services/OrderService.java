package com.happyfarmer.backend.services;

import com.happyfarmer.backend.dto.CreateOrderRequest;
import com.happyfarmer.backend.dto.OrderItemRequest;
import com.happyfarmer.backend.dto.OrderResponse;
import com.happyfarmer.backend.dto.FarmerDTO;
import com.happyfarmer.backend.models.*;
import com.happyfarmer.backend.repositories.FarmerRepository;
import com.happyfarmer.backend.repositories.OrderRepository;
import com.happyfarmer.backend.repositories.ProductRepository;
import com.happyfarmer.backend.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final FarmerRepository farmerRepository;
    private final UserRepository userRepository;
    private final CartService cartService;

    public List<OrderResponse> getOrdersForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> orders = orderRepository.findByCustomerId(user.getId());

        List<OrderResponse> responses = new ArrayList<>();
        for (Order order : orders) {
            responses.add(mapToResponse(order, "Order retrieved"));
        }
        return responses;
    }

    public List<OrderResponse> getOrdersForFarmer(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Farmer farmer = farmerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("No farmer profile found for this user."));

        List<Order> orders = orderRepository.findByFarmerId(farmer.getId());

        List<OrderResponse> responses = new ArrayList<>();
        for (Order order : orders) {
            responses.add(mapToResponse(order, "Order retrieved"));
        }
        return responses;
    }

    private OrderResponse mapToResponse(Order order, String message) {
        OrderResponse res = new OrderResponse();
        res.setId(order.getId());
        res.setStatus(order.getStatus().name());
        res.setTotalAmount(order.getTotalAmount());
        res.setCreatedAt(order.getCreatedAt());
        res.setDeliveryAddress(order.getDeliveryAddress());
        res.setMessage(message);

        if (order.getFarmer() != null) {

            FarmerDTO farmerDTO = new FarmerDTO();
            farmerDTO.setFarmName(order.getFarmer().getFarmName());
            farmerDTO.setBio(order.getFarmer().getBio());
            farmerDTO.setContactEmail(order.getFarmer().getContactEmail());
            farmerDTO.setContactPhone(order.getFarmer().getContactPhone());
            farmerDTO.setAddress(order.getFarmer().getAddress());
            farmerDTO.setOffersDelivery(order.getFarmer().getOffersDelivery());
            farmerDTO.setDeliveryRadiusKm(order.getFarmer().getDeliveryRadiusKm());
            farmerDTO.setDeliveryFeeBase(order.getFarmer().getDeliveryFeeBase());
            farmerDTO.setOffersPickup(order.getFarmer().getOffersPickup());
            farmerDTO.setPickupInstructions(order.getFarmer().getPickupInstructions());
            res.setFarmer(farmerDTO);
        }
        return res;
    }

    @Transactional
    public OrderResponse updateOrderStatus(java.util.UUID orderId, String newStatusStr, String farmerEmail) {
        User user = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Farmer farmer = farmerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Farmer profile not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getFarmer() == null || !order.getFarmer().getId().equals(farmer.getId())) {
            throw new RuntimeException("Unauthorized: You are not the farmer for this order.");
        }

        try {
            OrderStatus newStatus = OrderStatus.valueOf(newStatusStr);
            order.setStatus(newStatus);
            order.setUpdatedAt(java.time.LocalDateTime.now());
            Order savedOrder = orderRepository.save(order);
            return mapToResponse(savedOrder, "Order status updated to " + newStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid order status: " + newStatusStr);
        }
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, String userEmail) {
        // 1. Fetch User (Customer)
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFarmerId() == null) {
            throw new RuntimeException("Farmer ID is required");
        }

        // 2. Fetch Farmer
        Farmer farmer = farmerRepository.findById(request.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        // 3. Create Order
        Order order = new Order();
        order.setCustomer(customer);
        order.setFarmer(farmer);
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDelivery(request.isDelivery());
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        // 4. Process Items
        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Deduct stock (simple version)
            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPricePerUnit(product.getPrice()); // Use current price at time of order

            orderItems.add(orderItem);

            // Calculate Total
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        // 5. Save Order
        Order savedOrder = orderRepository.save(order);

        // 6. Clear Cart
        cartService.clearCart(userEmail);

        // 7. Map to Response
        return mapToResponse(savedOrder, "Order placed successfully!");
    }
}
