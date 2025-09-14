-- Clean SQL schema for QUIZ//PLATFORM

DROP DATABASE IF EXISTS quiz_db;
CREATE DATABASE quiz_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quiz_db;

-- Users table
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(16) NOT NULL
) ENGINE=InnoDB;

-- Quizzes table
CREATE TABLE quiz (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  difficulty VARCHAR(16) NOT NULL
) ENGINE=InnoDB;

-- Questions table
CREATE TABLE question (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  text VARCHAR(500) NOT NULL,
  quiz_id BIGINT NOT NULL,
  CONSTRAINT fk_question_quiz FOREIGN KEY (quiz_id) REFERENCES quiz(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Question options table
CREATE TABLE question_options (
  question_id BIGINT NOT NULL,
  option_id BIGINT NOT NULL,
  option_text VARCHAR(255) NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_option_question FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE,
  UNIQUE KEY unique_option_id_per_question (question_id, option_id)
) ENGINE=InnoDB;

-- Attempts table
CREATE TABLE attempt (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT NOT NULL,
  quiz_id BIGINT NOT NULL,
  score INT NOT NULL,
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_attempt_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_attempt_quiz FOREIGN KEY (quiz_id) REFERENCES quiz(id) ON DELETE CASCADE
) ENGINE=InnoDB;



