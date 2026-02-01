package com.happyfarmer.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ReviewDTO {
    private UUID id;
    private UUID farmerId;
    private UUID customerId;
    private String customerName;
    private String customerProfileImage;
    private Integer rating;
    private String comment;
    private String farmerReply;
    private LocalDateTime replyCreatedAt;
    private LocalDateTime createdAt;
}
