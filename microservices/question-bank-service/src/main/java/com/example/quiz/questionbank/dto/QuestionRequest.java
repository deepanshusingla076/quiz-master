package com.example.quiz.questionbank.dto;

import com.example.quiz.questionbank.domain.Question;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

@Data
public class QuestionRequest {
    
    @NotBlank(message = "Question text is required")
    private String text;
    
    @NotNull(message = "Question type is required")
    private Question.QuestionType type;
    
    @Positive(message = "Marks must be positive")
    private Integer marks;
    
    private List<OptionRequest> options;
    
    private String correctAnswer; // For non-multiple choice questions
}