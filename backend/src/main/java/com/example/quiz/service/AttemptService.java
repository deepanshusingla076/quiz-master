package com.example.quiz.service;

import com.example.quiz.domain.Attempt;
import com.example.quiz.domain.Question;
import com.example.quiz.domain.Quiz;
import com.example.quiz.domain.User;
import com.example.quiz.repo.AttemptRepository;
import com.example.quiz.repo.QuizRepository;
import org.springframework.stereotype.Service;
import com.example.quiz.ws.LeaderboardPublisher;

import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class AttemptService {
    private final AttemptRepository attemptRepository;
    private final QuizRepository quizRepository;
    private final Random random = new Random();
    private final LeaderboardPublisher leaderboardPublisher;

    public AttemptService(AttemptRepository attemptRepository, QuizRepository quizRepository, LeaderboardPublisher leaderboardPublisher) {
        this.attemptRepository = attemptRepository;
        this.quizRepository = quizRepository;
        this.leaderboardPublisher = leaderboardPublisher;
    }

    public Attempt attempt(User student, Long quizId, List<Map<String, Long>> answers) {
        if (student == null) {
            throw new IllegalArgumentException("Student cannot be null");
        }
        if (quizId == null) {
            throw new IllegalArgumentException("Quiz ID cannot be null");
        }
        
        Quiz q = quizRepository.findById(quizId)
            .orElseThrow(() -> new IllegalStateException("Quiz not found with ID: " + quizId));
        
        // Calculate score based on correct answers
        final List<Question> questionsList = q.getQuestions() != null ? q.getQuestions() : List.of();
        int totalQuestions = questionsList.size();
        final int[] correctAnswers = {0}; // Using array for effective final in lambda
        
        if (answers != null && !answers.isEmpty()) {
            answers.stream()
                .filter(answer -> answer != null) // Filter out null answers
                .forEach(answer -> {
                    try {
                        Long questionId = answer.get("questionId");
                        Long optionId = answer.get("optionId");
                        
                        if (questionId == null || optionId == null) {
                            return; // Skip this answer if questionId or optionId is null
                        }
                        
                        // Find the question in the quiz
                        if (questionsList.isEmpty()) {
                            return; // Skip if no questions available
                        }
                        questionsList.stream()
                            .filter(question -> question.getId().equals(questionId))
                            .findFirst()
                            .ifPresent(question -> {
                                // Check if the selected option is correct
                                boolean isCorrect = question.getOptions().stream()
                                    .filter(option -> option.getId() != null && option.getId().equals(optionId))
                                    .findFirst()
                                    .map(Question.QuestionOption::isCorrect)
                                    .orElse(false);
                                
                                if (isCorrect) {
                                    correctAnswers[0]++;
                                }
                            });
                    } catch (Exception e) {
                        // Log the error but continue processing other answers
                        System.err.println("Error processing answer: " + e.getMessage());
                        e.printStackTrace(); // Add stack trace for better debugging
                    }
                });
        }
        
        // Calculate percentage score
        int score = totalQuestions > 0 ? (correctAnswers[0] * 100) / totalQuestions : 0;
        
        Attempt a = new Attempt();
        a.setStudent(student);
        a.setQuiz(q);
        a.setScore(score);
        Attempt saved = attemptRepository.save(a);
        
        try {
            if (leaderboardPublisher != null) {
                leaderboardPublisher.publishAttempt(saved);
            }
        } catch (Exception e) {
            // Log the error but don't fail the attempt if leaderboard publishing fails
            System.err.println("Error publishing to leaderboard: " + e.getMessage());
            e.printStackTrace(); // Add stack trace for better debugging
        }
        
        return saved;
    }

    public List<Attempt> attemptsFor(User student) { return attemptRepository.findByStudent(student); }
}


