USE quiz_db;

INSERT INTO users (name, email, password_hash, role) VALUES
  ('Alice Teacher', 'alice@example.com', '$2a$10$z1t8u7e8uQnZJ0oF8FQdUuQy2GgHk7d0mXn3gZ8tH6k8E5y9u3m4a', 'TEACHER'),
  ('Bob Student', 'bob@example.com', '$2a$10$z1t8u7e8uQnZJ0oF8FQdUuQy2GgHk7d0mXn3gZ8tH6k8E5y9u3m4a', 'STUDENT');
-- The above bcrypt hash corresponds to password: Passw0rd!

INSERT INTO quiz (title, difficulty) VALUES
  ('Java Basics', 'EASY'),
  ('Spring Boot Intro', 'MEDIUM');


