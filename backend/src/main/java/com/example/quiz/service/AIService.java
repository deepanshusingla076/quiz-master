package com.example.quiz.service;

import com.example.quiz.domain.Question;
import com.example.quiz.domain.Quiz;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AIService {
    
    public List<Question> generateQuestions(Quiz.Difficulty difficulty, String prompt) {
        return generateMockQuestions(difficulty);
    }
    
    private List<Question> generateMockQuestions(Quiz.Difficulty difficulty) {
        List<Question> questions = new ArrayList<>();
        
        if (difficulty == Quiz.Difficulty.EASY) {
            questions.add(createMockQuestion(
                "What is the capital of France?",
                List.of("Paris", "London", "Berlin", "Madrid"),
                0
            ));
            questions.add(createMockQuestion(
                "What is 2 + 2?",
                List.of("3", "4", "5", "6"),
                1
            ));
            questions.add(createMockQuestion(
                "What color do you get when you mix red and blue?",
                List.of("Green", "Purple", "Orange", "Yellow"),
                1
            ));
        } else if (difficulty == Quiz.Difficulty.MEDIUM) {
            questions.add(createMockQuestion(
                "What is the largest planet in our solar system?",
                List.of("Earth", "Jupiter", "Saturn", "Neptune"),
                1
            ));
            questions.add(createMockQuestion(
                "Who wrote 'To Kill a Mockingbird'?",
                List.of("Harper Lee", "Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald"),
                0
            ));
            questions.add(createMockQuestion(
                "What is the chemical symbol for gold?",
                List.of("Go", "Gd", "Au", "Ag"),
                2
            ));
        } else {
            questions.add(createMockQuestion(
                "What is the derivative of x²?",
                List.of("x", "2x", "x²", "2x²"),
                1
            ));
            questions.add(createMockQuestion(
                "Which programming paradigm does Haskell primarily use?",
                List.of("Object-oriented", "Functional", "Procedural", "Logic"),
                1
            ));
            questions.add(createMockQuestion(
                "What is the time complexity of quicksort in the average case?",
                List.of("O(n)", "O(n log n)", "O(n²)", "O(log n)"),
                1
            ));
        }
        
        return questions;
    }
    
    private Question createMockQuestion(String text, List<String> options, int correctIndex) {
        Question question = new Question();
        question.setText(text);
        
        List<Question.QuestionOption> questionOptions = new ArrayList<>();
        for (int i = 0; i < options.size(); i++) {
            questionOptions.add(new Question.QuestionOption(options.get(i), i == correctIndex));
        }
        question.setOptions(questionOptions);
        
        return question;
    }
}