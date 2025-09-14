package com.example.quiz.web;

import com.example.quiz.domain.QuestionBank;
import com.example.quiz.domain.BankQuestion;
import com.example.quiz.microservices.QuestionBankService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/question-bank")
@CrossOrigin(origins = "http://localhost:5173")
public class QuestionBankController {
    private final QuestionBankService questionBankService;

    public QuestionBankController(QuestionBankService questionBankService) {
        this.questionBankService = questionBankService;
    }

    @PostMapping
    public QuestionBank createQuestionBank(@RequestBody CreateQuestionBankRequest request) {
        return questionBankService.createQuestionBank(request.subject(), request.difficulty());
    }

    @GetMapping
    public List<QuestionBank> getAllQuestionBanks() {
        return questionBankService.getAllQuestionBanks();
    }

    @GetMapping("/{id}")
    public QuestionBank getQuestionBankById(@PathVariable Long id) {
        return questionBankService.getQuestionBankById(id)
            .orElseThrow(() -> new RuntimeException("Question bank not found"));
    }

    @GetMapping("/{id}/questions")
    public List<BankQuestion> getQuestionsByBankId(@PathVariable Long id) {
        return questionBankService.getQuestionsByBankId(id);
    }

    @PostMapping("/{id}/questions")
    public BankQuestion addQuestionToBank(@PathVariable Long id, @RequestBody AddQuestionRequest request) {
        return questionBankService.addQuestionToBank(id, request.text(), request.options());
    }

    @DeleteMapping("/{id}")
    public void deleteQuestionBank(@PathVariable Long id) {
        questionBankService.deleteQuestionBank(id);
    }

    public record CreateQuestionBankRequest(String subject, QuestionBank.Difficulty difficulty) {}
    public record AddQuestionRequest(String text, List<BankQuestion.QuestionOption> options) {}
}
