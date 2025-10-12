package com.happyfarmer.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // Informs Spring Boot this class is a configuration class, so it is processed on startup.
public class CorsConfig {
    @Bean // Tells Spring to create this bean and use it in the application context.
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Applies this CORS setup to all routes (`/**` means every endpoint).
                        .allowedOrigins("http://localhost:5173") // Permits cross-origin requests only from the frontend on port 5173 (the React dev server).
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Specifies which HTTP methods are allowed.
                        .allowedHeaders("*") // Allows all headers (for development—can restrict for production).
                        .allowCredentials(true); // Allows sending cookies or auth credentials in cross-origin requests.
            }
        };
    }
}
