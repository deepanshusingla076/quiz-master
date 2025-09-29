package com.example.quiz.auth.dto;

import com.example.quiz.auth.domain.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private Role role;
    private String groupSection;
    private Long userId;
}