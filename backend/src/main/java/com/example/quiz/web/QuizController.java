package com.example.quiz.web;

import com.example.quiz.domain.Quiz;
import com.example.quiz.domain.Question;
import com.example.quiz.service.QuizService;
import com.example.quiz.service.AIService;
import org.springframework.security.core.Authentication;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class QuizController {
    private final QuizService quizService;
    private final AIService aiService;

    public QuizController(QuizService quizService, AIService aiService) {
        this.quizService = quizService;
        this.aiService = aiService;
    }

    record CreateQuizRequest(@NotBlank String title, Quiz.Difficulty difficulty) {}
    record AIGenerateRequest(Quiz.Difficulty difficulty, String prompt) {}

    @GetMapping
    public List<Quiz> all() { return quizService.all(); }

    @PostMapping
    public Quiz create(@RequestBody CreateQuizRequest req, Authentication authentication) {
        // role enforcement can be added later or via Security
        return quizService.create(req.title(), req.difficulty());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        quizService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/available")
    public List<Quiz> available() { return quizService.all(); }
    
    @GetMapping("/{id}/questions")
    public List<Question> getQuestions(@PathVariable Long id) {
        return quizService.getQuestions(id);
    }
    
    @PutMapping("/{id}/questions")
    public ResponseEntity<?> saveQuestions(@PathVariable Long id, @RequestBody List<Question> questions) {
        quizService.saveQuestions(id, questions);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{id}/ai-generate")
    public List<Question> generateWithAI(@PathVariable Long id, @RequestBody AIGenerateRequest req) {
        List<Question> questions = aiService.generateQuestions(req.difficulty(), req.prompt());
        quizService.saveQuestions(id, questions);
        return questions;
    }
    
    @PostMapping("/{id}/questions/batch")
    public ResponseEntity<?> addQuestionsBatch(@PathVariable Long id, @RequestBody List<Question> questions) {
        quizService.saveQuestions(id, questions);
        return ResponseEntity.ok().build();
    }
}


