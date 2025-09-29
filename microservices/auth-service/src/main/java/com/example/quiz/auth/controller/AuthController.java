package com.example.quiz.auth.controller;

import com.example.quiz.auth.dto.AuthResponse;
import com.example.quiz.auth.dto.LoginRequest;
import com.example.quiz.auth.dto.SignupRequest;
import com.example.quiz.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            logger.info("Login attempt for email: {}", request.getEmail());
            AuthResponse response = authService.login(request);
            logger.info("Login successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login failed for email: {} - Error: {}", request.getEmail(), e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        try {
            logger.info("Signup attempt for email: {}", request.getEmail());
            AuthResponse response = authService.signup(request);
            logger.info("Signup successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Signup failed for email: {} - Error: {}", request.getEmail(), e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestParam String token) {
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(isValid);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.error("Missing or invalid Authorization header");
                Map<String, String> error = new HashMap<>();
                error.put("error", "Missing or invalid authorization header");
                return ResponseEntity.status(401).body(error);
            }

            String token = authHeader.substring(7); // Remove "Bearer " prefix
            logger.info("Validating token for /me endpoint");
            
            // First validate the token
            if (!authService.validateToken(token)) {
                logger.error("Invalid token provided");
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid or expired token");
                return ResponseEntity.status(401).body(error);
            }

            // Get user info from token
            AuthResponse userInfo = authService.getUserFromToken(token);
            logger.info("Token validation successful for user: {}", userInfo.getEmail());
            
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            logger.error("Error validating token: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Token validation failed");
            return ResponseEntity.status(403).body(error);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth Service is running");
    }
}