package com.example.quiz.repo;

import com.example.quiz.domain.Attempt;
import com.example.quiz.domain.Quiz;
import com.example.quiz.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttemptRepository extends JpaRepository<Attempt, Long> {
    List<Attempt> findByStudent(User user);
    List<Attempt> findByQuiz(Quiz quiz);
    List<Attempt> findByQuizId(Long quizId);
    
    // Method to check if a student has already attempted a specific quiz
    Optional<Attempt> findByStudentAndQuiz(User student, Quiz quiz);
    
    // Alternative method using quiz ID
    Optional<Attempt> findByStudentAndQuizId(User student, Long quizId);
    
    // Check if exists (more efficient for just checking)
    boolean existsByStudentAndQuiz(User student, Quiz quiz);
    boolean existsByStudentAndQuizId(User student, Long quizId);
}


