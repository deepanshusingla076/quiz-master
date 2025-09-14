package com.example.quiz.microservices;

import com.example.quiz.domain.Attempt;
import com.example.quiz.domain.User;
import com.example.quiz.repo.AttemptRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ResultService {
    private final AttemptRepository attemptRepository;

    public ResultService(AttemptRepository attemptRepository) {
        this.attemptRepository = attemptRepository;
    }

    public Map<String, Object> getStudentResults(User student) {
        List<Attempt> attempts = attemptRepository.findByStudent(student);
        
        if (attempts.isEmpty()) {
            return Map.of(
                "totalAttempts", 0,
                "averageScore", 0.0,
                "highestScore", 0,
                "lowestScore", 0,
                "recentAttempts", List.of()
            );
        }

        double averageScore = attempts.stream()
            .mapToInt(Attempt::getScore)
            .average()
            .orElse(0.0);

        int highestScore = attempts.stream()
            .mapToInt(Attempt::getScore)
            .max()
            .orElse(0);

        int lowestScore = attempts.stream()
            .mapToInt(Attempt::getScore)
            .min()
            .orElse(0);

        List<Map<String, Object>> recentAttempts = attempts.stream()
            .limit(5)
            .map(attempt -> {
                Map<String, Object> attemptMap = new java.util.HashMap<>();
                attemptMap.put("quizId", attempt.getQuiz().getId());
                attemptMap.put("score", attempt.getScore());
                attemptMap.put("createdAt", attempt.getCreatedAt());
                return attemptMap;
            })
            .collect(Collectors.toList());

        return Map.of(
            "totalAttempts", attempts.size(),
            "averageScore", Math.round(averageScore * 100.0) / 100.0,
            "highestScore", highestScore,
            "lowestScore", lowestScore,
            "recentAttempts", recentAttempts
        );
    }

    public Map<String, Object> getQuizStatistics(Long quizId) {
        List<Attempt> attempts = attemptRepository.findByQuizId(quizId);
        
        if (attempts.isEmpty()) {
            return Map.of(
                "totalAttempts", 0,
                "averageScore", 0.0,
                "highestScore", 0,
                "lowestScore", 0
            );
        }

        double averageScore = attempts.stream()
            .mapToInt(Attempt::getScore)
            .average()
            .orElse(0.0);

        int highestScore = attempts.stream()
            .mapToInt(Attempt::getScore)
            .max()
            .orElse(0);

        int lowestScore = attempts.stream()
            .mapToInt(Attempt::getScore)
            .min()
            .orElse(0);

        return Map.of(
            "totalAttempts", attempts.size(),
            "averageScore", Math.round(averageScore * 100.0) / 100.0,
            "highestScore", highestScore,
            "lowestScore", lowestScore
        );
    }

    public List<Map<String, Object>> getLeaderboard() {
        return attemptRepository.findAll().stream()
            .map(attempt -> {
                Map<String, Object> leaderMap = new java.util.HashMap<>();
                leaderMap.put("studentName", attempt.getStudent().getName());
                leaderMap.put("quizTitle", attempt.getQuiz().getTitle());
                leaderMap.put("score", attempt.getScore());
                leaderMap.put("createdAt", attempt.getCreatedAt());
                return leaderMap;
            })
            .sorted((a, b) -> Integer.compare((Integer) b.get("score"), (Integer) a.get("score")))
            .limit(10)
            .collect(Collectors.toList());
    }
}
