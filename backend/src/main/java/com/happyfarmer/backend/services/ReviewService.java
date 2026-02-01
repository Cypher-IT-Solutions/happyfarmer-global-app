package com.happyfarmer.backend.services;

import com.happyfarmer.backend.dto.ReviewDTO;
import com.happyfarmer.backend.models.Farmer;
import com.happyfarmer.backend.models.Review;
import com.happyfarmer.backend.models.User;
import com.happyfarmer.backend.repositories.FarmerRepository;
import com.happyfarmer.backend.repositories.ReviewRepository;
import com.happyfarmer.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final FarmerRepository farmerRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewDTO createReview(UUID farmerId, UUID customerId, Integer rating, String comment) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Review review = new Review();
        review.setFarmer(farmer);
        review.setCustomer(customer);
        review.setRating(rating);
        review.setComment(comment);

        Review savedReview = reviewRepository.save(review);
        return mapToDTO(savedReview);
    }

    @Transactional
    public ReviewDTO replyToReview(UUID reviewId, UUID userId, String reply) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Verify the user is the farmer of this review
        if (!review.getFarmer().getUser().getId().equals(userId)) {
            throw new RuntimeException("Only the farmer can reply to this review");
        }

        review.setFarmerReply(reply);
        review.setReplyCreatedAt(LocalDateTime.now());

        Review updatedReview = reviewRepository.save(review);
        return mapToDTO(updatedReview);
    }

    public List<ReviewDTO> getReviewsByFarmer(UUID farmerId) {
        return reviewRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Double getAverageRating(UUID farmerId) {
        List<Review> reviews = reviewRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId);
        if (reviews.isEmpty()) {
            return 0.0;
        }
        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }

    private ReviewDTO mapToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setFarmerId(review.getFarmer().getId());
        dto.setCustomerId(review.getCustomer().getId());
        dto.setCustomerName(review.getCustomer().getFullName());
        dto.setCustomerProfileImage(review.getCustomer().getProfileImageUrl());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setFarmerReply(review.getFarmerReply());
        dto.setReplyCreatedAt(review.getReplyCreatedAt());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}
