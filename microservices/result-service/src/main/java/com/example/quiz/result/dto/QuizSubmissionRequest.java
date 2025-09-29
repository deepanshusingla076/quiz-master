package com.example.quiz.result.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
public class QuizSubmissionRequest {
    
    @NotNull(message = "Quiz ID is required")
    private Long quizId;
    
    @NotNull(message = "Answers are required")
    private List<AnswerRequest> answers;
    
    private Integer timeTakenMinutes;
    
    @Data
    public static class AnswerRequest {
        @NotNull(message = "Question ID is required")
        private Long questionId;
        
        private String answer;
    }
}