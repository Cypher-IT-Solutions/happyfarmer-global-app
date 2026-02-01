package com.happyfarmer.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.http.SessionCreationPolicy;
import java.util.List;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        @Autowired
        private JwtAuthenticationFilter jwtAuthFilter;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/health", "/api/auth/**", "/api/geocoding/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/farmers", "/api/farmers/**",
                                                                "/api/products",
                                                                "/api/products/**")
                                                .permitAll()
                                                .requestMatchers("/api/farmers/upgrade").authenticated()
                                                .requestMatchers("/api/users/**").authenticated()
                                                .requestMatchers("/api/cart/**").authenticated()
                                                .requestMatchers("/api/orders", "/api/orders/**").authenticated()
                                                .requestMatchers("/api/products/**").authenticated()
                                                .requestMatchers("/api/favorites/**").authenticated()
                                                .anyRequest().authenticated())
                                .cors(withDefaults())
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(List.of(
                                "http://localhost:5173",
                                "http://localhost:5174",
                                "http://localhost:5175",
                                "http://localhost:5176")); // Allow React dev server on various ports
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Common REST
                                                                                                     // methods
                configuration.setAllowedHeaders(List.of("*")); // Accept all request headers
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration); // Applies CORS to all endpoints
                return source;
        }
}
