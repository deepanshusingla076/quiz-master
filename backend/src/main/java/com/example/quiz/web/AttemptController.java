package com.example.quiz.web;

import com.example.quiz.domain.Attempt;
import com.example.quiz.domain.User;
import com.example.quiz.service.AttemptService;
import com.example.quiz.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attempt")
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

    @PostMapping
    public ResponseEntity<?> submitAttempt(@RequestBody AttemptRequest request, Authentication authentication) {
        try {
            User student = getCurrentUser(authentication);
            
            // Check if student has already attempted this quiz
            if (attemptService.hasStudentAttemptedQuiz(student, request.quizId())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "You have already attempted this quiz. Multiple attempts are not allowed."));
            }
            
            Attempt attempt = attemptService.submitAttempt(request.quizId(), student, request.answers());
            return ResponseEntity.ok(attempt);
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred while submitting the quiz."));
        }
    }

    @GetMapping("/my")
    public List<Attempt> myAttempts(Authentication authentication) {
        return attemptService.attemptsFor(getCurrentUser(authentication));
    }
    
    @GetMapping("/check/{quizId}")
    public ResponseEntity<Map<String, Boolean>> checkQuizAttempted(@PathVariable Long quizId, Authentication authentication) {
        try {
            User student = getCurrentUser(authentication);
            boolean attempted = attemptService.hasStudentAttemptedQuiz(student, quizId);
            return ResponseEntity.ok(Map.of("attempted", attempted));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("attempted", false));
        }
    }

    public record AttemptRequest(Long quizId, List<Long> answers) {}
}


