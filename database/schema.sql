-- Quiz Platform Database Schema for Microservices Architecture

-- Users table (Auth Service)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('TEACHER', 'STUDENT') NOT NULL,
    group_section VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Quizzes table (Question Bank Service)
CREATE TABLE IF NOT EXISTS quizzes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id BIGINT NOT NULL,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL,
    time_limit_minutes INT,
    total_marks INT,
    assigned_groups TEXT, -- Comma-separated group names
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Questions table (Question Bank Service)
CREATE TABLE IF NOT EXISTS questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    text TEXT NOT NULL,
    type ENUM('MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_IN_BLANK') NOT NULL,
    marks INT NOT NULL,
    correct_answer TEXT,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Question Options table (Question Bank Service)
CREATE TABLE IF NOT EXISTS question_options (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT NOT NULL,
    text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Quiz Attempts table (Result Service)
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    group_section VARCHAR(100),
    total_marks INT,
    obtained_marks INT,
    percentage DOUBLE,
    status ENUM('IN_PROGRESS', 'SUBMITTED', 'PUBLISHED') NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP NULL,
    time_taken_minutes INT,
    visible_to_student BOOLEAN DEFAULT FALSE,
    UNIQUE KEY unique_quiz_student (quiz_id, student_id)
);

-- Student Answers table (Result Service)
CREATE TABLE IF NOT EXISTS student_answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    attempt_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    student_answer TEXT,
    correct_answer TEXT,
    is_correct BOOLEAN,
    marks_awarded INT,
    total_marks INT,
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_quizzes_teacher_id ON quizzes(teacher_id);
CREATE INDEX idx_quizzes_active ON quizzes(is_active);
CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX idx_question_options_question_id ON question_options(question_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_student_id ON quiz_attempts(student_id);
CREATE INDEX idx_quiz_attempts_visible ON quiz_attempts(visible_to_student);
CREATE INDEX idx_student_answers_attempt_id ON student_answers(attempt_id);
CREATE INDEX idx_student_answers_question_id ON student_answers(question_id);

-- Sample data for testing
INSERT IGNORE INTO users (email, password, name, role, group_section) VALUES
('teacher@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye3JGnl5r9mT/ek5JgGIW.LbOYmIQLMDG', 'John Teacher', 'TEACHER', NULL),
('student1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye3JGnl5r9mT/ek5JgGIW.LbOYmIQLMDG', 'Alice Student', 'STUDENT', 'CS-A'),
('student2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye3JGnl5r9mT/ek5JgGIW.LbOYmIQLMDG', 'Bob Student', 'STUDENT', 'CS-B');

-- Note: Password is 'password' encoded with BCrypt