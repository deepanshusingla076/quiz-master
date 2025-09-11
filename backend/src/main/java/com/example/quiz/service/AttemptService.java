package com.example.quiz.service;

import com.example.quiz.domain.Attempt;
import com.example.quiz.domain.Quiz;
import com.example.quiz.domain.User;
import com.example.quiz.repo.AttemptRepository;
import com.example.quiz.repo.QuizRepository;
import org.springframework.stereotype.Service;
import com.example.quiz.ws.LeaderboardPublisher;

import java.util.List;
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

    public Attempt attempt(User student, Long quizId) {
        Quiz q = quizRepository.findById(quizId).orElseThrow();
        Attempt a = new Attempt();
        a.setStudent(student);
        a.setQuiz(q);
        a.setScore(40 + random.nextInt(61)); // mock scoring 40-100
        Attempt saved = attemptRepository.save(a);
        leaderboardPublisher.publishAttempt(saved);
        return saved;
    }

    public List<Attempt> attemptsFor(User student) { return attemptRepository.findByStudent(student); }
}


