package com.example.quiz.web;

import com.example.quiz.domain.Role;
import com.example.quiz.domain.User;
import com.example.quiz.security.JwtUtil;
import com.example.quiz.security.SessionUser;
import com.example.quiz.service.UserService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    record SignupRequest(@NotBlank String name, @Email String email, @NotBlank String password, Role role) {}
    record LoginRequest(@Email String email, @NotBlank String password) {}
    record AuthResponse(String token, SessionUser user) {}

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {
        User u = userService.signup(req.name(), req.email(), req.password(), req.role());
        String token = jwtUtil.generateToken(u.getEmail(), u.getRole().name());
        return ResponseEntity.ok(new AuthResponse(token, SessionUser.from(u)));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        User u = userService.findByEmail(req.email()).orElseThrow();
        if (!passwordEncoder.matches(req.password(), u.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }
        String token = jwtUtil.generateToken(u.getEmail(), u.getRole().name());
        return ResponseEntity.ok(new AuthResponse(token, SessionUser.from(u)));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();
        User u = userService.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(SessionUser.from(u));
    }
}


