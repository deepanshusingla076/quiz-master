package com.example.quiz.result.service;

import com.example.quiz.result.client.QuestionBankClient;
import com.example.quiz.result.domain.QuizAttempt;
import com.example.quiz.result.domain.StudentAnswer;
import com.example.quiz.result.dto.AttemptResponse;
import com.example.quiz.result.dto.QuizSubmissionRequest;
import com.example.quiz.result.repository.QuizAttemptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResultService {

    @Autowired
    private QuizAttemptRepository attemptRepository;

    @Autowired
    private QuestionBankClient questionBankClient;

    @Transactional
    public QuizAttempt startAttempt(Long quizId, Long studentId, String studentEmail, String studentName, String groupSection) {
        // Check if student has already attempted this quiz
        if (attemptRepository.existsByQuizIdAndStudentId(quizId, studentId)) {
            throw new RuntimeException("Quiz already attempted. Only one attempt is allowed.");
        }

        // Get quiz details from Question Bank Service
        QuestionBankClient.QuizDto quiz = questionBankClient.getQuizById(quizId);
        
        QuizAttempt attempt = new QuizAttempt();
        attempt.setQuizId(quizId);
        attempt.setStudentId(studentId);
        attempt.setStudentEmail(studentEmail);
        attempt.setStudentName(studentName);
        attempt.setGroupSection(groupSection);
        attempt.setTotalMarks(quiz.totalMarks);
        attempt.setStatus(QuizAttempt.AttemptStatus.IN_PROGRESS);
        attempt.setStartedAt(LocalDateTime.now());

        return attemptRepository.save(attempt);
    }

    @Transactional
    public QuizAttempt submitQuiz(QuizSubmissionRequest request, Long studentId) {
        QuizAttempt attempt = attemptRepository.findByQuizIdAndStudentId(request.getQuizId(), studentId)
                .orElseThrow(() -> new RuntimeException("No active attempt found for this quiz"));

        if (attempt.getStatus() != QuizAttempt.AttemptStatus.IN_PROGRESS) {
            throw new RuntimeException("Quiz has already been submitted");
        }

        // Get quiz questions from Question Bank Service
        List<QuestionBankClient.QuestionDto> questions = questionBankClient.getQuizQuestions(request.getQuizId());

        // Process answers and calculate score
        List<StudentAnswer> studentAnswers = processAnswers(request.getAnswers(), questions, attempt);
        attempt.setAnswers(studentAnswers);

        // Calculate total score
        int obtainedMarks = studentAnswers.stream()
                .mapToInt(answer -> answer.getMarksAwarded() != null ? answer.getMarksAwarded() : 0)
                .sum();

        attempt.setObtainedMarks(obtainedMarks);
        attempt.setPercentage(attempt.getTotalMarks() > 0 ? 
            (double) obtainedMarks / attempt.getTotalMarks() * 100 : 0.0);
        attempt.setSubmittedAt(LocalDateTime.now());
        attempt.setTimeTakenMinutes(request.getTimeTakenMinutes());
        attempt.setStatus(QuizAttempt.AttemptStatus.SUBMITTED);
        attempt.setVisibleToStudent(false); // Results hidden until teacher publishes

        return attemptRepository.save(attempt);
    }

    private List<StudentAnswer> processAnswers(List<QuizSubmissionRequest.AnswerRequest> answers, 
                                             List<QuestionBankClient.QuestionDto> questions, 
                                             QuizAttempt attempt) {
        return answers.stream().map(answerReq -> {
            QuestionBankClient.QuestionDto question = questions.stream()
                    .filter(q -> q.id.equals(answerReq.getQuestionId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Question not found: " + answerReq.getQuestionId()));

            StudentAnswer studentAnswer = new StudentAnswer();
            studentAnswer.setAttempt(attempt);
            studentAnswer.setQuestionId(question.id);
            studentAnswer.setStudentAnswer(answerReq.getAnswer());
            studentAnswer.setCorrectAnswer(question.correctAnswer);
            studentAnswer.setTotalMarks(question.marks);

            // Check if answer is correct
            boolean isCorrect = checkAnswer(answerReq.getAnswer(), question);
            studentAnswer.setIsCorrect(isCorrect);
            studentAnswer.setMarksAwarded(isCorrect ? question.marks : 0);

            return studentAnswer;
        }).collect(Collectors.toList());
    }

    private boolean checkAnswer(String studentAnswer, QuestionBankClient.QuestionDto question) {
        if (studentAnswer == null || studentAnswer.trim().isEmpty()) {
            return false;
        }

        switch (question.type.toUpperCase()) {
            case "MULTIPLE_CHOICE":
                // For multiple choice, check against correct option
                return question.options.stream()
                        .anyMatch(option -> option.isCorrect && option.text.equals(studentAnswer));
            case "TRUE_FALSE":
                return question.correctAnswer != null && 
                       question.correctAnswer.equalsIgnoreCase(studentAnswer.trim());
            case "FILL_IN_BLANK":
                return question.correctAnswer != null && 
                       question.correctAnswer.equalsIgnoreCase(studentAnswer.trim());
            default:
                return false;
        }
    }

    public List<AttemptResponse> getStudentAttempts(Long studentId, boolean visibleOnly) {
        List<QuizAttempt> attempts = visibleOnly ? 
            attemptRepository.findByStudentIdAndVisibleToStudentTrue(studentId) :
            attemptRepository.findByStudentId(studentId);

        return attempts.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<AttemptResponse> getQuizAttempts(Long quizId) {
        List<QuizAttempt> attempts = attemptRepository.findByQuizId(quizId);
        return attempts.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<AttemptResponse> getQuizAttemptsByGroup(Long quizId, String groupSection) {
        List<QuizAttempt> attempts = attemptRepository.findByQuizIdAndGroupSection(quizId, groupSection);
        return attempts.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void publishResults(Long quizId, Long teacherId) {
        // Verify teacher owns the quiz by calling Question Bank Service
        QuestionBankClient.QuizDto quiz = questionBankClient.getQuizById(quizId);
        if (!quiz.teacherId.equals(teacherId)) {
            throw new RuntimeException("Unauthorized to publish results for this quiz");
        }

        List<QuizAttempt> attempts = attemptRepository.findByQuizId(quizId);
        attempts.forEach(attempt -> {
            attempt.setVisibleToStudent(true);
            attempt.setStatus(QuizAttempt.AttemptStatus.PUBLISHED);
        });
        
        attemptRepository.saveAll(attempts);
    }

    @Transactional
    public void unpublishResults(Long quizId, Long teacherId) {
        // Verify teacher owns the quiz
        QuestionBankClient.QuizDto quiz = questionBankClient.getQuizById(quizId);
        if (!quiz.teacherId.equals(teacherId)) {
            throw new RuntimeException("Unauthorized to unpublish results for this quiz");
        }

        List<QuizAttempt> attempts = attemptRepository.findByQuizId(quizId);
        attempts.forEach(attempt -> {
            attempt.setVisibleToStudent(false);
            if (attempt.getStatus() == QuizAttempt.AttemptStatus.PUBLISHED) {
                attempt.setStatus(QuizAttempt.AttemptStatus.SUBMITTED);
            }
        });
        
        attemptRepository.saveAll(attempts);
    }

    private AttemptResponse convertToResponse(QuizAttempt attempt) {
        return new AttemptResponse(
            attempt.getId(),
            attempt.getQuizId(),
            attempt.getStudentName(),
            attempt.getStudentEmail(),
            attempt.getGroupSection(),
            attempt.getTotalMarks(),
            attempt.getObtainedMarks(),
            attempt.getPercentage(),
            attempt.getStatus(),
            attempt.getStartedAt(),
            attempt.getSubmittedAt(),
            attempt.getTimeTakenMinutes(),
            attempt.getVisibleToStudent()
        );
    }
}