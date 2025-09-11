package com.example.quiz.web;

import com.example.quiz.domain.Role;
import com.example.quiz.domain.User;
import com.example.quiz.security.SessionUser;
import com.example.quiz.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    record SignupRequest(@NotBlank String name, @Email String email, @NotBlank String password, Role role) {}
    record LoginRequest(@Email String email, @NotBlank String password) {}

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req, HttpSession session) {
        User u = userService.signup(req.name(), req.email(), req.password(), req.role());
        session.setAttribute("userId", u.getId());
        return ResponseEntity.ok(SessionUser.from(u));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpSession session) {
        User u = userService.findByEmail(req.email()).orElseThrow();
        if (!passwordEncoder.matches(req.password(), u.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }
        session.setAttribute("userId", u.getId());
        return ResponseEntity.ok(SessionUser.from(u));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        Object id = session.getAttribute("userId");
        if (id == null) return ResponseEntity.status(401).build();
        User u = userService.findById((Long) id).orElseThrow();
        return ResponseEntity.ok(SessionUser.from(u));
    }
}


