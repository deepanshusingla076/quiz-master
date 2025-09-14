# API Testing Guide with JWT Tokens

## 🔑 Authentication Tokens

### Teacher Account
**Email:** deepanshu@gmail.com  
**Role:** TEACHER  
**Access Token:**
```
eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVEVBQ0hFUiIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiJkZWVwYW5zaHVAZ21haWwuY29tIiwiaWF0IjoxNzU3ODU3MzcxLCJleHAiOjE3NTc5NDM3NzF9.p4TB08h3CfGx1ylw8-UzRCx-QNdFG0SYgQc0dT-54mI
```

### Student Account
**Email:** deepa@gmail.com  
**Role:** STUDENT  
**Access Token:**
```
eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiU1RVREVOVCIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiJkZWVwYUBnbWFpbC5jb20iLCJpYXQiOjE3NTc4NTc0MTUsImV4cCI6MTc1Nzk0MzgxNX0.rzr0uN9ZbbXQTFIEFtxNoo4JvY3Qc3-gYN_c50d8Y5o
```

## 📋 Complete API Testing Workflow

### 1. Quiz Management (Teacher Only)

#### Create Quiz
```http
POST http://localhost:8080/api/quiz
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVEVBQ0hFUiIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiJkZWVwYW5zaHVAZ21haWwuY29tIiwiaWF0IjoxNzU3ODU3MzcxLCJleHAiOjE3NTc5NDM3NzF9.p4TB08h3CfGx1ylw8-UzRCx-QNdFG0SYgQc0dT-54mI
Content-Type: application/json

{
  "title": "Java Programming Basics",
  "difficulty": "MEDIUM"
}
```

#### Add Questions to Quiz
```http
POST http://localhost:8080/api/quiz/1/questions
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVEVBQ0hFUiIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiJkZWVwYW5zaHVAZ21haWwuY29tIiwiaWF0IjoxNzU3ODU3MzcxLCJleHAiOjE3NTc5NDM3NzF9.p4TB08h3CfGx1ylw8-UzRCx-QNdFG0SYgQc0dT-54mI
Content-Type: application/json

{
  "text": "What is the main method signature in Java?",
  "options": [
    {"text": "public static void main(String[] args)", "correct": true},
    {"text": "public void main(String[] args)", "correct": false},
    {"text": "static void main(String[] args)", "correct": false},
    {"text": "public main(String[] args)", "correct": false}
  ]
}
```

#### Get All Quizzes
```http
GET http://localhost:8080/api/quiz
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVEVBQ0hFUiIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiJkZWVwYW5zaHVAZ21haWwuY29tIiwiaWF0IjoxNzU3ODU3MzcxLCJleHAiOjE3NTc5NDM3NzF9.p4TB08h3CfGx1ylw8-UzRCx-QNdFG0SYgQc0dT-54mI
```

### 2. Question Bank Management (Microservice)

#### Create Question Bank
```http
POST http://localhost:8080/api/question-bank
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVEVBQ0hFUiIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiJkZWVwYW5zaHVAZ21haWwuY29tIiwiaWF0IjoxNzU3ODU3MzcxLCJleHAiOjE3NTc5NDM3NzF9.p4TB08h3CfGx1ylw8-UzRCx-QNdFG0SYgQc0dT-54mI
Content-Type: application/json

{
  "subject": "Java Programming",
  "difficulty": "MEDIUM"
}
```

#### Add Questions to Bank
```http
POST http://localhost:8080/api/question-bank/1/questions
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVEVBQ0hFUiIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiJkZWVwYW5zaHVAZ21haWwuY29tIiwiaWF0IjoxNzU3ODU3MzcxLCJleHAiOjE3NTc5NDM3NzF9.p4TB08h3CfGx1ylw8-UzRCx-QNdFG0SYgQc0dT-54mI
Content-Type: application/json

{
  "text": "Which keyword is used for inheritance in Java?",
  "options": [
    {"text": "extends", "correct": true},
    {"text": "implements", "correct": false},
    {"text": "inherits", "correct": false},
    {"text": "super", "correct": false}
  ]
}
```

### 3. AI Quiz Generation (Teacher Only)

#### Generate Quiz with AI
```http
POST http://localhost:8080/api/ai/generate
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVEVBQ0hFUiIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiJkZWVwYW5zaHVAZ21haWwuY29tIiwiaWF0IjoxNzU3ODU3MzcxLCJleHAiOjE3NTc5NDM3NzF9.p4TB08h3CfGx1ylw8-UzRCx-QNdFG0SYgQc0dT-54mI
Content-Type: application/json

{
  "subject": "Python Programming",
  "difficulty": "EASY",
  "numberOfQuestions": 5
}
```

### 4. Student Quiz Taking

#### Get Available Quizzes (Student)
```http
GET http://localhost:8080/api/quiz
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiU1RVREVOVCIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiJkZWVwYUBnbWFpbC5jb20iLCJpYXQiOjE3NTc4NTc0MTUsImV4cCI6MTc1Nzk0MzgxNX0.rzr0uN9ZbbXQTFIEFtxNoo4JvY3Qc3-gYN_c50d8Y5o
```

#### Submit Quiz Attempt
```http
POST http://localhost:8080/api/attempt
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiU1RVREVOVCIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiJkZWVwYUBnbWFpbC5jb20iLCJpYXQiOjE3NTc4NTc0MTUsImV4cCI6MTc1Nzk0MzgxNX0.rzr0uN9ZbbXQTFIEFtxNoo4JvY3Qc3-gYN_c50d8Y5o
Content-Type: application/json

{
  "quizId": 1,
  "answers": [
    {"questionId": 1, "selectedOption": 0},
    {"questionId": 2, "selectedOption": 1}
  ]
}
```

### 5. Results & Analytics (Microservice)

#### Get Student Results
```http
GET http://localhost:8080/api/result/student
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiU1RVREVOVCIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiJkZWVwYUBnbWFpbC5jb20iLCJpYXQiOjE3NTc4NTc0MTUsImV4cCI6MTc1Nzk0MzgxNX0.rzr0uN9ZbbXQTFIEFtxNoo4JvY3Qc3-gYN_c50d8Y5o
```

#### Get Quiz Statistics (Teacher)
```http
GET http://localhost:8080/api/result/quiz/1
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVEVBQ0hFUiIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiJkZWVwYW5zaHVAZ21haWwuY29tIiwiaWF0IjoxNzU3ODU3MzcxLCJleHAiOjE3NTc5NDM3NzF9.p4TB08h3CfGx1ylw8-UzRCx-QNdFG0SYgQc0dT-54mI
```

#### Get Leaderboard
```http
GET http://localhost:8080/api/result/leaderboard
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiU1RVREVOVCIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiJkZWVwYUBnbWFpbC5jb20iLCJpYXQiOjE3NTc4NTc0MTUsImV4cCI6MTc1Nzk0MzgxNX0.rzr0uN9ZbbXQTFIEFtxNoo4JvY3Qc3-gYN_c50d8Y5o
```

### 6. Analytics Dashboard (Teacher)

#### Get Analytics Data
```http
GET http://localhost:8080/api/analytics/dashboard
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVEVBQ0hFUiIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiJkZWVwYW5zaHVAZ21haWwuY29tIiwiaWF0IjoxNzU3ODU3MzcxLCJleHAiOjE3NTc5NDM3NzF9.p4TB08h3CfGx1ylw8-UzRCx-QNdFG0SYgQc0dT-54mI
```

## 🔧 Postman Environment Setup

### Environment Variables
Create these variables in Postman:
- `baseUrl`: `http://localhost:8080`
- `teacherToken`: `eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVEVBQ0hFUiIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiJkZWVwYW5zaHVAZ21haWwuY29tIiwiaWF0IjoxNzU3ODU3MzcxLCJleHAiOjE3NTc5NDM3NzF9.p4TB08h3CfGx1ylw8-UzRCx-QNdFG0SYgQc0dT-54mI`
- `studentToken`: `eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiU1RVREVOVCIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiJkZWVwYUBnbWFpbC5jb20iLCJpYXQiOjE3NTc4NTc0MTUsImV4cCI6MTc1Nzk0MzgxNX0.rzr0uN9ZbbXQTFIEFtxNoo4JvY3Qc3-gYN_c50d8Y5o`

### Usage in Requests
Use `{{baseUrl}}` and `{{teacherToken}}` or `{{studentToken}}` in your requests:

```
Authorization: Bearer {{teacherToken}}
```

## ✅ Testing Checklist

### Authentication
- [x] Teacher login working
- [x] Student login working
- [x] JWT tokens generated
- [x] Role-based access working

### Teacher Features
- [ ] Create quiz
- [ ] Add questions
- [ ] Edit quiz
- [ ] Delete quiz
- [ ] View analytics
- [ ] Generate AI quiz

### Student Features
- [ ] View available quizzes
- [ ] Take quiz
- [ ] Submit answers
- [ ] View results
- [ ] See leaderboard

### Microservices
- [ ] Question bank creation
- [ ] Question bank management
- [ ] Result service analytics
- [ ] Performance tracking

## 🚨 Expected Responses

### Successful Quiz Creation
```json
{
  "id": 1,
  "title": "Java Programming Basics",
  "difficulty": "MEDIUM",
  "createdBy": {
    "id": 1,
    "name": "Deepanshu",
    "email": "deepanshu@gmail.com",
    "role": "TEACHER"
  }
}
```

### Successful Quiz Attempt
```json
{
  "id": 1,
  "student": {
    "id": 7,
    "name": "deepa",
    "email": "deepa@gmail.com",
    "role": "STUDENT"
  },
  "quiz": {
    "id": 1,
    "title": "Java Programming Basics"
  },
  "score": 85,
  "createdAt": "2025-09-14T19:15:00Z"
}
```

## 🔍 Troubleshooting

### Common Issues
1. **401 Unauthorized**: Check JWT token validity
2. **403 Forbidden**: Verify user role permissions
3. **404 Not Found**: Ensure quiz/question exists
4. **500 Internal Error**: Check server logs

### Token Expiry
If tokens expire, use the refresh endpoint:
```http
POST http://localhost:8080/api/auth/refresh
Content-Type: application/json

{
  "token": "REFRESH_TOKEN_HERE"
}
```

---

**Base URL**: http://localhost:8080  
**Authentication**: Bearer JWT Token  
**Content-Type**: application/json
