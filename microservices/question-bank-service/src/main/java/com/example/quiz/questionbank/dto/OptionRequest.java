package com.example.quiz.questionbank.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class OptionRequest {
    
    @NotBlank(message = "Option text is required")
    private String text;
    
    @NotNull(message = "isCorrect flag is required")
    private Boolean isCorrect;
}