package com.example.quiz.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Quiz {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;
    
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();

    public enum Difficulty { EASY, MEDIUM, HARD }
}


