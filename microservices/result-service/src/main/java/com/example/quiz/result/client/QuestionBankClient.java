package com.example.quiz.result.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "question-bank-service")
public interface QuestionBankClient {
    
    @GetMapping("/quizzes/{quizId}")
    QuizDto getQuizById(@PathVariable("quizId") Long quizId);
    
    @GetMapping("/quizzes/{quizId}/questions")
    java.util.List<QuestionDto> getQuizQuestions(@PathVariable("quizId") Long quizId);
    
    // DTOs for communication
    class QuizDto {
        public Long id;
        public String title;
        public Integer totalMarks;
        public Long teacherId;
        public String assignedGroups;
    }
    
    class QuestionDto {
        public Long id;
        public String text;
        public String type;
        public Integer marks;
        public String correctAnswer;
        public java.util.List<OptionDto> options;
    }
    
    class OptionDto {
        public Long id;
        public String text;
        public Boolean isCorrect;
    }
}