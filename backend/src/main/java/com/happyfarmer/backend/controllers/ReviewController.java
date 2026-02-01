package com.happyfarmer.backend.controllers;

import com.happyfarmer.backend.dto.ReviewDTO;
import com.happyfarmer.backend.models.User;
import com.happyfarmer.backend.services.ReviewService;
import com.happyfarmer.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;

    @PostMapping("/farmer/{farmerId}")
    public ResponseEntity<ReviewDTO> createReview(
            @PathVariable UUID farmerId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {

        User user = userService.getUserByEmail(authentication.getName());
        Integer rating = (Integer) payload.get("rating");
        String comment = (String) payload.get("comment");

        return ResponseEntity.ok(reviewService.createReview(farmerId, user.getId(), rating, comment));
    }

    @PostMapping("/{reviewId}/reply")
    public ResponseEntity<ReviewDTO> replyToReview(
            @PathVariable UUID reviewId,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {

        User user = userService.getUserByEmail(authentication.getName());
        String reply = payload.get("reply");

        return ResponseEntity.ok(reviewService.replyToReview(reviewId, user.getId(), reply));
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<ReviewDTO>> getFarmerReviews(@PathVariable UUID farmerId) {
        return ResponseEntity.ok(reviewService.getReviewsByFarmer(farmerId));
    }

    @GetMapping("/farmer/{farmerId}/rating")
    public ResponseEntity<Double> getFarmerAverageRating(@PathVariable UUID farmerId) {
        return ResponseEntity.ok(reviewService.getAverageRating(farmerId));
    }
}
