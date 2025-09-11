package com.example.quiz.ws;

import com.example.quiz.domain.Attempt;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class LeaderboardPublisher {
    private final SimpMessagingTemplate messagingTemplate;

    public LeaderboardPublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void publishAttempt(Attempt attempt) {
        messagingTemplate.convertAndSend("/topic/leaderboard", Map.of(
            "studentId", attempt.getStudent().getId(),
            "quizId", attempt.getQuiz().getId(),
            "score", attempt.getScore()
        ));
    }
}


