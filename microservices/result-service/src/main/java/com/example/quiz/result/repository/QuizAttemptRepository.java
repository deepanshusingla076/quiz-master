package com.example.quiz.result.repository;

import com.example.quiz.result.domain.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    
    Optional<QuizAttempt> findByQuizIdAndStudentId(Long quizId, Long studentId);
    
    List<QuizAttempt> findByStudentIdAndVisibleToStudentTrue(Long studentId);
    
    List<QuizAttempt> findByStudentId(Long studentId);
    
    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.quizId = :quizId")
    List<QuizAttempt> findByQuizId(@Param("quizId") Long quizId);
    
    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.quizId = :quizId AND qa.groupSection = :groupSection")
    List<QuizAttempt> findByQuizIdAndGroupSection(@Param("quizId") Long quizId, @Param("groupSection") String groupSection);
    
    boolean existsByQuizIdAndStudentId(Long quizId, Long studentId);
}