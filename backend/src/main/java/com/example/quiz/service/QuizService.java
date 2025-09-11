package com.example.quiz.service;

import com.example.quiz.domain.Quiz;
import com.example.quiz.repo.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {
    private final QuizRepository quizRepository;

    public QuizService(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    public Quiz create(String title, Quiz.Difficulty difficulty) {
        Quiz q = new Quiz();
        q.setTitle(title);
        q.setDifficulty(difficulty);
        return quizRepository.save(q);
    }

    public List<Quiz> all() { return quizRepository.findAll(); }
    public void delete(Long id) { quizRepository.deleteById(id); }
}


