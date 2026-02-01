package com.happyfarmer.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GeocodingService {

    private static final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
    private final RestTemplate restTemplate = new RestTemplate();
    private long lastRequestTime = 0;

    /**
     * Rate limiting to comply with Nominatim's usage policy (max 1 request per
     * second)
     */
    private synchronized void rateLimit() {
        long currentTime = System.currentTimeMillis();
        long timeSinceLastRequest = currentTime - lastRequestTime;
        if (timeSinceLastRequest < 1000) {
            try {
                Thread.sleep(1000 - timeSinceLastRequest);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        lastRequestTime = System.currentTimeMillis();
    }

    /**
     * Geocode an address to latitude and longitude using OpenStreetMap Nominatim
     * API.
     * Returns null if geocoding fails.
     */
    public double[] geocodeAddress(String address) {
        if (address == null || address.trim().isEmpty()) {
            return null;
        }

        try {
            rateLimit(); // Respect Nominatim's rate limit

            String formattedQuery = address.replace(" ", "+");
            String url = String.format("%s?q=%s&format=json&limit=1&addressdetails=1",
                    NOMINATIM_URL, formattedQuery);
            System.out.println("Geocoding URL: " + url);

            // Nominatim requires a User-Agent header and prefers Referer
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("User-Agent", "HappyFarmer/1.0 (contact@happyfarmer.com)");
            headers.set("Referer", "http://localhost:8080");

            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);

            org.springframework.http.ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    org.springframework.http.HttpMethod.GET,
                    entity,
                    new org.springframework.core.ParameterizedTypeReference<List<Map<String, Object>>>() {
                    });

            List<Map<String, Object>> results = response.getBody();
            System.out.println("Geocoding results: " + results);

            if (results != null && !results.isEmpty()) {
                Map<String, Object> location = results.get(0);
                double lat = Double.parseDouble(location.get("lat").toString());
                double lon = Double.parseDouble(location.get("lon").toString());
                return new double[] { lat, lon };
            }

            return null;
        } catch (Exception e) {
            System.err.println("Geocoding failed for address: " + address + " - " + e.getMessage());
            return null;
        }
    }

    /**
     * Search for address suggestions using Nominatim API.
     * Returns a list of suggestions with display names and coordinates.
     */
    public List<Map<String, Object>> searchAddresses(String query, int limit) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }

        try {
            rateLimit(); // Respect Nominatim's rate limit

            String formattedQuery = query.replace(" ", "+");
            String url = String.format("%s?q=%s&format=json&limit=%d&addressdetails=1&polygon_kml=1",
                    NOMINATIM_URL, formattedQuery, limit);
            System.out.println("Geocoding URL: " + url);

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("User-Agent", "HappyFarmer/1.0 (contact@happyfarmer.com)");
            headers.set("Referer", "http://localhost:8080");

            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);

            org.springframework.http.ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    org.springframework.http.HttpMethod.GET,
                    entity,
                    new org.springframework.core.ParameterizedTypeReference<List<Map<String, Object>>>() {
                    });
            System.out.println("Geocoding results: " + response.getBody());

            return response.getBody() != null ? response.getBody() : List.of();
        } catch (Exception e) {
            System.err.println("Address search failed for query: " + query + " - " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }
}
