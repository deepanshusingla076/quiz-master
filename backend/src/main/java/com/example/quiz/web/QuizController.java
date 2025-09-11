package com.example.quiz.web;

import com.example.quiz.domain.Quiz;
import com.example.quiz.domain.User;
import com.example.quiz.service.QuizService;
import com.example.quiz.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class QuizController {
    private final QuizService quizService;
    private final UserService userService;

    public QuizController(QuizService quizService, UserService userService) {
        this.quizService = quizService;
        this.userService = userService;
    }

    record CreateQuizRequest(@NotBlank String title, Quiz.Difficulty difficulty) {}

    private User sessionUser(HttpSession session) { return userService.findById((Long)session.getAttribute("userId")).orElseThrow(); }

    @GetMapping
    public List<Quiz> all() { return quizService.all(); }

    @PostMapping
    public Quiz create(@RequestBody CreateQuizRequest req, HttpSession session) {
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
}


