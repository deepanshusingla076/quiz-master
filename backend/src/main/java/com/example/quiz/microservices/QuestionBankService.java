package com.example.quiz.microservices;

import com.example.quiz.domain.QuestionBank;
import com.example.quiz.domain.BankQuestion;
import com.example.quiz.repo.QuestionBankRepository;
import com.example.quiz.repo.BankQuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service("questionBankMicroservice")
public class QuestionBankService {
    private final QuestionBankRepository questionBankRepository;
    private final BankQuestionRepository bankQuestionRepository;

    public QuestionBankService(QuestionBankRepository questionBankRepository, 
                              BankQuestionRepository bankQuestionRepository) {
        this.questionBankRepository = questionBankRepository;
        this.bankQuestionRepository = bankQuestionRepository;
    }

    public QuestionBank createQuestionBank(String subject, QuestionBank.Difficulty difficulty) {
        QuestionBank questionBank = new QuestionBank();
        questionBank.setSubject(subject);
        questionBank.setDifficulty(difficulty);
        return questionBankRepository.save(questionBank);
    }

    public QuestionBank saveQuestionBankWithQuestions(QuestionBank questionBank) {
        // Save the question bank first
        QuestionBank savedBank = questionBankRepository.save(questionBank);
        
        // Save all questions associated with this bank
        if (questionBank.getQuestions() != null && !questionBank.getQuestions().isEmpty()) {
            for (BankQuestion question : questionBank.getQuestions()) {
                question.setQuestionBank(savedBank);
                bankQuestionRepository.save(question);
            }
        }
        
        return savedBank;
    }

    public List<QuestionBank> getAllQuestionBanks() {
        return questionBankRepository.findAll();
    }

    public Optional<QuestionBank> getQuestionBankById(Long id) {
        return questionBankRepository.findById(id);
    }

    public List<BankQuestion> getQuestionsByBankId(Long bankId) {
        return bankQuestionRepository.findByQuestionBankId(bankId);
    }

    public BankQuestion addQuestionToBank(Long bankId, String questionText, List<BankQuestion.QuestionOption> options) {
        QuestionBank bank = questionBankRepository.findById(bankId)
            .orElseThrow(() -> new RuntimeException("Question bank not found"));
        
        BankQuestion question = new BankQuestion();
        question.setText(questionText);
        question.setQuestionBank(bank);
        question.setOptions(options);
        
        return bankQuestionRepository.save(question);
    }

    public void deleteQuestionBank(Long id) {
        questionBankRepository.deleteById(id);
    }
}
