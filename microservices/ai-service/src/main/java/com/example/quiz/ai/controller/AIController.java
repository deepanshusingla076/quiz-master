package com.example.quiz.ai.controller;

import com.example.quiz.ai.service.AIQuizGeneratorService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping
@RequiredArgsConstructor
@Slf4j
public class AIController {
    
    private final AIQuizGeneratorService aiQuizGeneratorService;
    
    public record GenerateRequest(
        @NotBlank String subject,
        @NotBlank String difficulty,
        @Min(1) @Max(20) int numberOfQuestions
    ) {}
    
    @PostMapping("/generate")
    public ResponseEntity<?> generateQuiz(
            @Valid @RequestBody GenerateRequest request,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role) {
        
        if (!"TEACHER".equals(role)) {
            return ResponseEntity.status(403).body(Map.of("error", "Only teachers can generate quizzes"));
        }
        
        try {
            log.info("Generating AI quiz for user {} - Subject: {}, Difficulty: {}, Questions: {}", 
                userId, request.subject(), request.difficulty(), request.numberOfQuestions());
            
            Map<String, Object> response = aiQuizGeneratorService.generateQuiz(
                request.subject(), 
                request.difficulty(), 
                request.numberOfQuestions()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error generating quiz", e);
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to generate quiz: " + e.getMessage()));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("AI Service is running");
    }
}