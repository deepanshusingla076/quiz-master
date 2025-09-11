package com.example.quiz.web;

import com.example.quiz.domain.Attempt;
import com.example.quiz.domain.User;
import com.example.quiz.security.SessionUser;
import com.example.quiz.service.AttemptService;
import com.example.quiz.service.UserService;
import jakarta.servlet.http.HttpSession;
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

    private User sessionUser(HttpSession session) { return userService.findById((Long)session.getAttribute("userId")).orElseThrow(); }

    @PostMapping("/{quizId}")
    public Attempt attempt(@PathVariable Long quizId, HttpSession session) {
        return attemptService.attempt(sessionUser(session), quizId);
    }

    @GetMapping("/mine")
    public List<Attempt> mine(HttpSession session) {
        return attemptService.attemptsFor(sessionUser(session));
    }
}


