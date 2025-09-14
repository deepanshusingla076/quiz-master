package com.example.quiz.web;

import com.example.quiz.domain.QuestionBank;
import com.example.quiz.service.AIQuizGeneratorService;
import com.example.quiz.microservices.QuestionBankService;
import org.springframework.beans.factory.annotation.Qualifier;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIQuizGeneratorController {

    private final AIQuizGeneratorService aiQuizGeneratorService;
    @Qualifier("questionBankMicroservice")
    private final QuestionBankService questionBankService;

    @PostMapping("/generate")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<QuestionBank> generateQuestionBank(@RequestBody AIGenerateRequest request) {
        try {
            QuestionBank questionBank = aiQuizGeneratorService.generateQuestionBank(
                    request.getSubject(), request.getDifficulty(), request.getNumberOfQuestions());
            
            // Save the generated question bank with all its questions
            QuestionBank savedQuestionBank = questionBankService.saveQuestionBankWithQuestions(questionBank);
            
            return ResponseEntity.ok(savedQuestionBank);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    public static class AIGenerateRequest {
        private String subject;
        private String difficulty;
        private int numberOfQuestions = 5;

        // Getters and setters
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getDifficulty() { return difficulty; }
        public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
        public int getNumberOfQuestions() { return numberOfQuestions; }
        public void setNumberOfQuestions(int numberOfQuestions) { this.numberOfQuestions = numberOfQuestions; }
    }
}