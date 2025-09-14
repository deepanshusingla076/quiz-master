#!/bin/bash

# Test script for quiz attempt functionality
echo "Testing quiz attempt functionality..."

# 1. Create a test user (if needed)
echo "Creating test user..."
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Student","email":"test@example.com","password":"password","role":"STUDENT"}'

# 2. Login to get JWT token
echo "\nLogging in..."
TOKEN=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  | grep -o '"token":"[^"]*"' | cut -d '"' -f 4)

echo "Token: $TOKEN"

# 3. Get available quizzes
echo "\nGetting available quizzes..."
curl -X GET http://localhost:8080/api/quiz/available \
  -H "Authorization: Bearer $TOKEN"

# 4. Get questions for the first quiz (assuming quiz ID 1 exists)
echo "\nGetting questions for quiz ID 1..."
curl -X GET http://localhost:8080/api/quiz/1/questions \
  -H "Authorization: Bearer $TOKEN"

# 5. Submit an attempt with answers
echo "\nSubmitting quiz attempt..."
curl -X POST http://localhost:8080/api/attempts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "quizId": 1,
    "answers": [
      {"questionId": 1, "optionId": 0},
      {"questionId": 2, "optionId": 1},
      {"questionId": 3, "optionId": 2}
    ]
  }'

# 6. Get user's attempts
echo "\nGetting user's attempts..."
curl -X GET http://localhost:8080/api/attempts/mine \
  -H "Authorization: Bearer $TOKEN"

echo "\nTest completed!"