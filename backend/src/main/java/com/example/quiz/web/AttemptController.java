package com.example.quiz.web;

import com.example.quiz.domain.Attempt;
import com.example.quiz.domain.User;
import com.example.quiz.service.AttemptService;
import com.example.quiz.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attempts")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AttemptController {
    private final AttemptService attemptService;
    private final UserService userService;

    public AttemptController(AttemptService attemptService, UserService userService) {
        this.attemptService = attemptService;
        this.userService = userService;
    }

    private User getCurrentUser(Authentication authentication) { 
        String email = authentication.getName();
        return userService.findByEmail(email).orElseThrow();
    }

    @PostMapping("/{quizId}")
    public Attempt attempt(@PathVariable Long quizId, Authentication authentication) {
        return attemptService.attempt(getCurrentUser(authentication), quizId);
    }

    @GetMapping("/mine")
    public List<Attempt> mine(Authentication authentication) {
        return attemptService.attemptsFor(getCurrentUser(authentication));
    }
}


