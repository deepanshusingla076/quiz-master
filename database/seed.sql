USE quiz_db;

INSERT INTO users (name, email, password_hash, role) VALUES
  ('Alice Teacher', 'alice@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'TEACHER'),
  ('Bob Student', 'bob@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'STUDENT');
-- The above bcrypt hash corresponds to password: Passw0rd!

INSERT INTO quiz (title, difficulty) VALUES
  ('Java Basics', 'EASY'),
  ('Spring Boot Intro', 'MEDIUM');


