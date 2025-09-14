package com.example.quiz.ws;

import com.example.quiz.domain.Attempt;

/**
 * Interface for publishing quiz attempt results to the leaderboard
 */
public interface LeaderboardPublisher {
    
    /**
     * Publishes an attempt to the leaderboard
     * 
     * @param attempt The attempt to publish
     */
    void publishAttempt(Attempt attempt);
}