package com.example.quiz.questionbank.repository;

import com.example.quiz.questionbank.domain.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    
    List<Quiz> findByTeacherId(Long teacherId);
    
    List<Quiz> findByIsActiveTrue();
    
    @Query("SELECT q FROM Quiz q WHERE q.assignedGroups LIKE %:groupSection% AND q.isActive = true")
    List<Quiz> findByAssignedGroupsContaining(@Param("groupSection") String groupSection);
}