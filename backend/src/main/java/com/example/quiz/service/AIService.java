package com.example.quiz.service;

import com.example.quiz.domain.Question;
import com.example.quiz.domain.Quiz;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AIService {
    
    public List<Question> generateQuestions(Quiz.Difficulty difficulty, String prompt) {
        // Use the prompt to generate more varied questions
        if (prompt != null && !prompt.trim().isEmpty()) {
            return generatePromptBasedQuestions(difficulty, prompt);
        }
        return generateMockQuestions(difficulty);
    }
    
    private List<Question> generatePromptBasedQuestions(Quiz.Difficulty difficulty, String prompt) {
        List<Question> questions = new ArrayList<>();
        
        // Generate questions based on the prompt
        if (prompt.toLowerCase().contains("history")) {
            questions.add(createMockQuestion(
                "Which year did World War II end?",
                List.of("1943", "1945", "1947", "1950"),
                1
            ));
            questions.add(createMockQuestion(
                "Who was the first President of the United States?",
                List.of("Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"),
                2
            ));
            questions.add(createMockQuestion(
                "Which ancient civilization built the pyramids at Giza?",
                List.of("Romans", "Greeks", "Mayans", "Egyptians"),
                3
            ));
        } else if (prompt.toLowerCase().contains("science")) {
            questions.add(createMockQuestion(
                "What is the chemical symbol for water?",
                List.of("H2O", "CO2", "O2", "NaCl"),
                0
            ));
            questions.add(createMockQuestion(
                "Which planet is known as the Red Planet?",
                List.of("Venus", "Jupiter", "Mars", "Saturn"),
                2
            ));
            questions.add(createMockQuestion(
                "What is the process by which plants make their own food?",
                List.of("Respiration", "Photosynthesis", "Digestion", "Fermentation"),
                1
            ));
        } else if (prompt.toLowerCase().contains("math")) {
            questions.add(createMockQuestion(
                "What is the value of π (pi) to two decimal places?",
                List.of("3.14", "3.16", "3.12", "3.18"),
                0
            ));
            questions.add(createMockQuestion(
                "What is the square root of 64?",
                List.of("6", "7", "8", "9"),
                2
            ));
            questions.add(createMockQuestion(
                "If x + 5 = 12, what is the value of x?",
                List.of("5", "6", "7", "8"),
                2
            ));
        } else {
            // Default to general knowledge questions
            questions.add(createMockQuestion(
                "Which country has the largest population in the world?",
                List.of("India", "United States", "China", "Russia"),
                2
            ));
            questions.add(createMockQuestion(
                "What is the capital of Japan?",
                List.of("Seoul", "Beijing", "Tokyo", "Bangkok"),
                2
            ));
            questions.add(createMockQuestion(
                "Which language has the most native speakers worldwide?",
                List.of("English", "Spanish", "Hindi", "Mandarin Chinese"),
                3
            ));
        }
        
        return questions;
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
            questionOptions.add(new Question.QuestionOption((long)i, options.get(i), i == correctIndex));
        }
        question.setOptions(questionOptions);
        
        return question;
    }
}