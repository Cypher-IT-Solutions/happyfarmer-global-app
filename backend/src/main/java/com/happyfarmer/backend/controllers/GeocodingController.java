package com.happyfarmer.backend.controllers;

import com.happyfarmer.backend.services.GeocodingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/geocoding")
@RequiredArgsConstructor
public class GeocodingController {

    private final GeocodingService geocodingService;

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchAddresses(
            @RequestParam String q,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(geocodingService.searchAddresses(q, limit));
    }
}
