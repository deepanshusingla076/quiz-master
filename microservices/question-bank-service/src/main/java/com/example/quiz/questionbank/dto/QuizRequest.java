package com.example.quiz.questionbank.dto;

import com.example.quiz.questionbank.domain.Quiz;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

@Data
public class QuizRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Difficulty is required")
    private Quiz.Difficulty difficulty;
    
    @Positive(message = "Time limit must be positive")
    private Integer timeLimitMinutes;
    
    @Positive(message = "Total marks must be positive")
    private Integer totalMarks;
    
    @NotNull(message = "Assigned groups are required")
    private List<String> assignedGroups;
    
    private List<QuestionRequest> questions;
}