package com.example.quiz.questionbank.controller;

import com.example.quiz.questionbank.domain.Question;
import com.example.quiz.questionbank.domain.Quiz;
import com.example.quiz.questionbank.dto.QuizRequest;
import com.example.quiz.questionbank.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping("/quizzes")
    public ResponseEntity<Quiz> createQuiz(
            @Valid @RequestBody QuizRequest request,
            @RequestHeader("X-User-Id") Long teacherId,
            @RequestHeader("X-User-Role") String role) {
        
        if (!"TEACHER".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            Quiz quiz = quizService.createQuiz(request, teacherId);
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/quizzes/teacher")
    public ResponseEntity<List<Quiz>> getTeacherQuizzes(
            @RequestHeader("X-User-Id") Long teacherId,
            @RequestHeader("X-User-Role") String role) {
        
        if (!"TEACHER".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        
        List<Quiz> quizzes = quizService.getQuizzesByTeacher(teacherId);
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/quizzes/student")
    public ResponseEntity<List<Quiz>> getStudentQuizzes(
            @RequestHeader("X-User-Role") String role,
            @RequestParam String groupSection) {
        
        if (!"STUDENT".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        
        List<Quiz> quizzes = quizService.getQuizzesForStudent(groupSection);
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/quizzes/{quizId}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long quizId) {
        try {
            Quiz quiz = quizService.getQuizById(quizId);
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/quizzes/{quizId}/questions")
    public ResponseEntity<List<Question>> getQuizQuestions(@PathVariable Long quizId) {
        try {
            List<Question> questions = quizService.getQuestionsByQuizId(quizId);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/quizzes/{quizId}")
    public ResponseEntity<Quiz> updateQuiz(
            @PathVariable Long quizId,
            @Valid @RequestBody QuizRequest request,
            @RequestHeader("X-User-Id") Long teacherId,
            @RequestHeader("X-User-Role") String role) {
        
        if (!"TEACHER".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            Quiz quiz = quizService.updateQuiz(quizId, request, teacherId);
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/quizzes/{quizId}")
    public ResponseEntity<Void> deleteQuiz(
            @PathVariable Long quizId,
            @RequestHeader("X-User-Id") Long teacherId,
            @RequestHeader("X-User-Role") String role) {
        
        if (!"TEACHER".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            quizService.deleteQuiz(quizId, teacherId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Question Bank Service is running");
    }
}