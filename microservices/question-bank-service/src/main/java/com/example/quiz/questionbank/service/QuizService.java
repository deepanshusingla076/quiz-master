package com.example.quiz.questionbank.service;

import com.example.quiz.questionbank.domain.Question;
import com.example.quiz.questionbank.domain.QuestionOption;
import com.example.quiz.questionbank.domain.Quiz;
import com.example.quiz.questionbank.dto.OptionRequest;
import com.example.quiz.questionbank.dto.QuestionRequest;
import com.example.quiz.questionbank.dto.QuizRequest;
import com.example.quiz.questionbank.repository.QuestionRepository;
import com.example.quiz.questionbank.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Transactional
    public Quiz createQuiz(QuizRequest request, Long teacherId) {
        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setTeacherId(teacherId);
        quiz.setDifficulty(request.getDifficulty());
        quiz.setTimeLimitMinutes(request.getTimeLimitMinutes());
        quiz.setTotalMarks(request.getTotalMarks());
        quiz.setAssignedGroups(String.join(",", request.getAssignedGroups()));
        quiz.setIsActive(true);

        quiz = quizRepository.save(quiz);

        if (request.getQuestions() != null && !request.getQuestions().isEmpty()) {
            List<Question> questions = createQuestions(request.getQuestions(), quiz);
            quiz.setQuestions(questions);
        }

        return quiz;
    }

    private List<Question> createQuestions(List<QuestionRequest> questionRequests, Quiz quiz) {
        return questionRequests.stream().map(qr -> {
            Question question = new Question();
            question.setText(qr.getText());
            question.setType(qr.getType());
            question.setMarks(qr.getMarks());
            question.setQuiz(quiz);
            question.setCorrectAnswer(qr.getCorrectAnswer());

            if (qr.getOptions() != null && !qr.getOptions().isEmpty()) {
                List<QuestionOption> options = qr.getOptions().stream().map(or -> {
                    QuestionOption option = new QuestionOption();
                    option.setText(or.getText());
                    option.setIsCorrect(or.getIsCorrect());
                    option.setQuestion(question);
                    return option;
                }).collect(Collectors.toList());
                question.setOptions(options);
            }

            return questionRepository.save(question);
        }).collect(Collectors.toList());
    }

    public List<Quiz> getQuizzesByTeacher(Long teacherId) {
        return quizRepository.findByTeacherId(teacherId);
    }

    public List<Quiz> getQuizzesForStudent(String groupSection) {
        return quizRepository.findByAssignedGroupsContaining(groupSection);
    }

    public Quiz getQuizById(Long quizId) {
        return quizRepository.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
    }

    @Transactional
    public Quiz updateQuiz(Long quizId, QuizRequest request, Long teacherId) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));

        if (!quiz.getTeacherId().equals(teacherId)) {
            throw new RuntimeException("Unauthorized to update this quiz");
        }

        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setDifficulty(request.getDifficulty());
        quiz.setTimeLimitMinutes(request.getTimeLimitMinutes());
        quiz.setTotalMarks(request.getTotalMarks());
        quiz.setAssignedGroups(String.join(",", request.getAssignedGroups()));

        return quizRepository.save(quiz);
    }

    @Transactional
    public void deleteQuiz(Long quizId, Long teacherId) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));

        if (!quiz.getTeacherId().equals(teacherId)) {
            throw new RuntimeException("Unauthorized to delete this quiz");
        }

        quiz.setIsActive(false);
        quizRepository.save(quiz);
    }

    public List<Question> getQuestionsByQuizId(Long quizId) {
        return questionRepository.findByQuizId(quizId);
    }
}