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

    record AttemptRequest(Long quizId, List<AnswerSubmission> answers) {}
    record AnswerSubmission(Long questionId, Long optionId) {}
    
    @PostMapping
    public Attempt attempt(@RequestBody AttemptRequest request, Authentication authentication) {
        // Validate request
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }
        if (request.quizId() == null) {
            throw new IllegalArgumentException("Quiz ID cannot be null");
        }
        if (request.answers() == null) {
            throw new IllegalArgumentException("Answers cannot be null");
        }
        if (request.answers().isEmpty()) {
            throw new IllegalArgumentException("Answers cannot be empty");
        }
        
        // Convert AnswerSubmission objects to Map<String, Long> more efficiently
        List<java.util.Map<String, Long>> answersMap = request.answers().stream()
            .filter(answer -> answer != null) // Filter out null answers
            .filter(answer -> answer.questionId() != null && answer.optionId() != null)
            .map(answer -> java.util.Map.of(
                "questionId", answer.questionId(),
                "optionId", answer.optionId()
            ))
            .toList();
        
        if (answersMap.isEmpty()) {
            throw new IllegalArgumentException("No valid answers provided. All answers must have both questionId and optionId.");
        }
        
        User currentUser = getCurrentUser(authentication);
        if (currentUser == null) {
            throw new IllegalStateException("Authentication failed: User not found");
        }
        
        return attemptService.attempt(currentUser, request.quizId(), answersMap);
    }

    @GetMapping("/mine")
    public List<Attempt> mine(Authentication authentication) {
        return attemptService.attemptsFor(getCurrentUser(authentication));
    }
}


