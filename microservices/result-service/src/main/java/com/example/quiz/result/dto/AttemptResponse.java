package com.example.quiz.result.dto;

import com.example.quiz.result.domain.QuizAttempt;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AttemptResponse {
    private Long id;
    private Long quizId;
    private String studentName;
    private String studentEmail;
    private String groupSection;
    private Integer totalMarks;
    private Integer obtainedMarks;
    private Double percentage;
    private QuizAttempt.AttemptStatus status;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private Integer timeTakenMinutes;
    private Boolean visibleToStudent;
}