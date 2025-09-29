package com.example.quiz.auth.service;

import com.example.quiz.auth.domain.Role;
import com.example.quiz.auth.domain.User;
import com.example.quiz.auth.dto.AuthResponse;
import com.example.quiz.auth.dto.LoginRequest;
import com.example.quiz.auth.dto.SignupRequest;
import com.example.quiz.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Validate group section for students
        if (request.getRole() == Role.STUDENT && 
            (request.getGroupSection() == null || request.getGroupSection().trim().isEmpty())) {
            throw new RuntimeException("Group section is required for students");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setGroupSection(request.getRole() == Role.STUDENT ? request.getGroupSection() : null);

        user = userRepository.save(user);

        String token = jwtService.generateToken(
            user.getId(), 
            user.getEmail(), 
            user.getRole().name(), 
            user.getName(), 
            user.getGroupSection()
        );

        return new AuthResponse(token, user.getEmail(), user.getName(), 
                               user.getRole(), user.getGroupSection(), user.getId());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(
            user.getId(), 
            user.getEmail(), 
            user.getRole().name(), 
            user.getName(), 
            user.getGroupSection()
        );

        return new AuthResponse(token, user.getEmail(), user.getName(), 
                               user.getRole(), user.getGroupSection(), user.getId());
    }

    public boolean validateToken(String token) {
        return jwtService.validateToken(token);
    }

    public AuthResponse getUserFromToken(String token) {
        io.jsonwebtoken.Claims claims = jwtService.extractClaims(token);
        
        Long userId = Long.parseLong(claims.getSubject());
        String email = claims.get("email", String.class);
        String name = claims.get("name", String.class);
        String roleStr = claims.get("role", String.class);
        String groupSection = claims.get("groupSection", String.class);
        
        Role role = Role.valueOf(roleStr);
        
        return new AuthResponse(token, email, name, role, groupSection, userId);
    }
}