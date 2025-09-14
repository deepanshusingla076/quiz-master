package com.example.quiz.ws;

import com.example.quiz.domain.Attempt;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * Implementation of LeaderboardPublisher that uses WebSockets to publish attempt results
 */
@Service
public class LeaderboardPublisherImpl implements LeaderboardPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public LeaderboardPublisherImpl(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void publishAttempt(Attempt attempt) {
        if (attempt != null) {
            messagingTemplate.convertAndSend("/topic/leaderboard", attempt);
        }
    }
}