package com.example.quiz.result.controller;

import com.example.quiz.result.domain.QuizAttempt;
import com.example.quiz.result.dto.AttemptResponse;
import com.example.quiz.result.dto.QuizSubmissionRequest;
import com.example.quiz.result.service.ResultService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class ResultController {

    @Autowired
    private ResultService resultService;

    @PostMapping("/attempts/start/{quizId}")
    public ResponseEntity<QuizAttempt> startAttempt(
            @PathVariable Long quizId,
            @RequestHeader("X-User-Id") Long studentId,
            @RequestHeader("X-User-Email") String studentEmail,
            @RequestHeader("X-User-Role") String role,
            @RequestParam String studentName,
            @RequestParam String groupSection) {
        
        if (!"STUDENT".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            QuizAttempt attempt = resultService.startAttempt(quizId, studentId, studentEmail, studentName, groupSection);
            return ResponseEntity.ok(attempt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/attempts/submit")
    public ResponseEntity<QuizAttempt> submitQuiz(
            @Valid @RequestBody QuizSubmissionRequest request,
            @RequestHeader("X-User-Id") Long studentId,
            @RequestHeader("X-User-Role") String role) {
        
        if (!"STUDENT".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            QuizAttempt attempt = resultService.submitQuiz(request, studentId);
            return ResponseEntity.ok(attempt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/attempts/student")
    public ResponseEntity<List<AttemptResponse>> getStudentAttempts(
            @RequestHeader("X-User-Id") Long studentId,
            @RequestHeader("X-User-Role") String role,
            @RequestParam(defaultValue = "true") boolean visibleOnly) {
        
        if (!"STUDENT".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        
        List<AttemptResponse> attempts = resultService.getStudentAttempts(studentId, visibleOnly);
        return ResponseEntity.ok(attempts);
    }

    @GetMapping("/attempts/quiz/{quizId}")
    public ResponseEntity<List<AttemptResponse>> getQuizAttempts(
            @PathVariable Long quizId,
            @RequestHeader("X-User-Role") String role) {
        
        if (!"TEACHER".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        
        List<AttemptResponse> attempts = resultService.getQuizAttempts(quizId);
        return ResponseEntity.ok(attempts);
    }

    @GetMapping("/attempts/quiz/{quizId}/group/{groupSection}")
    public ResponseEntity<List<AttemptResponse>> getQuizAttemptsByGroup(
            @PathVariable Long quizId,
            @PathVariable String groupSection,
            @RequestHeader("X-User-Role") String role) {
        
        if (!"TEACHER".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        
        List<AttemptResponse> attempts = resultService.getQuizAttemptsByGroup(quizId, groupSection);
        return ResponseEntity.ok(attempts);
    }

    @PostMapping("/results/publish/{quizId}")
    public ResponseEntity<Void> publishResults(
            @PathVariable Long quizId,
            @RequestHeader("X-User-Id") Long teacherId,
            @RequestHeader("X-User-Role") String role) {
        
        if (!"TEACHER".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            resultService.publishResults(quizId, teacherId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/results/unpublish/{quizId}")
    public ResponseEntity<Void> unpublishResults(
            @PathVariable Long quizId,
            @RequestHeader("X-User-Id") Long teacherId,
            @RequestHeader("X-User-Role") String role) {
        
        if (!"TEACHER".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            resultService.unpublishResults(quizId, teacherId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Result Service is running");
    }
}