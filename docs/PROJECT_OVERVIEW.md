# Quiz Platform - Complete Project Documentation

## 🎯 Project Overview
A full-stack online quiz application built with Spring Boot (backend) and React (frontend) featuring JWT authentication, role-based access control, and AI-powered quiz generation.

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.3.3 with Java 21
- **Database**: MySQL 8.0 with JPA/Hibernate
- **Security**: JWT authentication with role-based access
- **API**: RESTful APIs with CORS support
- **Microservices**: Question Bank & Result services

### Frontend (React)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Custom CSS with brutal design system

## 📁 Project Structure

```
quiz-master/
├── backend/                    # Spring Boot Application
│   ├── src/main/java/com/example/quiz/
│   │   ├── config/            # Configuration classes
│   │   ├── domain/            # JPA entities
│   │   ├── microservices/     # Microservice components
│   │   ├── repo/              # JPA repositories
│   │   ├── security/          # JWT & security config
│   │   ├── service/           # Business logic
│   │   └── web/               # REST controllers
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/                   # React Application
│   ├── src/
│   │   ├── auth/              # Authentication context
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   └── types/             # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── database/
│   └── schema.sql             # Database schema
└── docs/                      # Project documentation
    ├── API_TESTING.md
    └── PROJECT_OVERVIEW.md
```

## 🔐 Authentication System

### User Roles
- **TEACHER**: Can create quizzes, manage questions, view analytics
- **STUDENT**: Can take quizzes, view results, see leaderboards

### JWT Implementation
- **Access Token**: 24 hours expiry
- **Refresh Token**: 7 days expiry
- **Security**: BCrypt password hashing

### Current Test Users
```json
{
  "teacher": {
    "email": "deepanshu@gmail.com",
    "password": "deepanshu",
    "role": "TEACHER",
    "id": 1
  },
  "student": {
    "email": "deepa@gmail.com", 
    "password": "deepa",
    "role": "STUDENT",
    "id": 7
  }
}
```

## 🎯 Core Features

### 1. Authentication & Authorization
- [x] User registration (Teacher/Student)
- [x] JWT-based login/logout
- [x] Role-based access control
- [x] Token refresh mechanism

### 2. Quiz Management (Teacher)
- [x] Create quizzes with difficulty levels
- [x] Add multiple-choice questions
- [x] Edit existing quizzes
- [x] Delete quizzes

### 3. Question Bank (Microservice)
- [x] Centralized question repository
- [x] Subject-wise categorization
- [x] Difficulty-based filtering
- [x] Reusable question library

### 4. AI Quiz Generation
- [x] Gemini AI integration
- [x] Auto-generate questions by topic
- [x] Configurable difficulty & count
- [x] Teacher approval workflow

### 5. Quiz Taking (Student)
- [x] Browse available quizzes
- [x] Take timed quizzes
- [x] Submit answers
- [x] Instant score calculation

### 6. Results & Analytics (Microservice)
- [x] Student performance tracking
- [x] Quiz statistics
- [x] Leaderboards
- [x] Analytics dashboard

## 🛠️ Technology Stack

### Backend Dependencies
```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
  </dependency>
  <dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
  </dependency>
  <dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
  </dependency>
</dependencies>
```

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "axios": "^1.7.7"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.4",
    "vite": "^5.4.3"
  }
}
```

## 🗄️ Database Schema

### Core Tables
- **users**: User accounts with roles
- **quiz**: Quiz metadata
- **question**: Quiz questions with options
- **attempt**: Student quiz attempts
- **question_bank**: Centralized question repository
- **bank_question**: Questions in question bank

### Relationships
- User (1) → (N) Quiz (created_by)
- Quiz (1) → (N) Question
- User (1) → (N) Attempt (student)
- Quiz (1) → (N) Attempt

## 🚀 Getting Started

### Prerequisites
- Java 21
- Maven 3.6+
- MySQL 8.0
- Node.js 18+

### Backend Setup
```bash
cd backend
mvn spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Database Setup
1. Start MySQL service: `net start MySQL80`
2. Database auto-created on first run
3. Tables auto-generated via Hibernate DDL

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

### Quiz Management
- `GET /api/quiz` - Get all quizzes
- `POST /api/quiz` - Create quiz (Teacher)
- `GET /api/quiz/{id}` - Get quiz details
- `PUT /api/quiz/{id}` - Update quiz (Teacher)
- `DELETE /api/quiz/{id}` - Delete quiz (Teacher)

### Question Management
- `GET /api/quiz/{id}/questions` - Get quiz questions
- `POST /api/quiz/{id}/questions` - Add question (Teacher)
- `PUT /api/quiz/{id}/questions` - Update questions (Teacher)

### Question Bank (Microservice)
- `GET /api/question-bank` - Get all question banks
- `POST /api/question-bank` - Create question bank
- `GET /api/question-bank/{id}/questions` - Get bank questions
- `POST /api/question-bank/{id}/questions` - Add bank question

### AI Quiz Generation
- `POST /api/ai/generate` - Generate quiz with AI (Teacher)

### Quiz Attempts
- `POST /api/attempt` - Submit quiz attempt (Student)
- `GET /api/attempt/student` - Get student attempts

### Results & Analytics
- `GET /api/result/student` - Student results (Microservice)
- `GET /api/result/quiz/{id}` - Quiz statistics (Microservice)
- `GET /api/result/leaderboard` - Global leaderboard
- `GET /api/analytics/dashboard` - Analytics dashboard

## 🔧 Configuration

### Application Properties
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/quiz_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=Deepanshu@123ds

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# Server Configuration
server.port=8080

# JWT Configuration
app.jwt.secret=my-super-secret-jwt-key-for-quiz-platform-2024-secure-key-very-long-and-secure-key-for-production-use
app.jwt.ttlSeconds=86400
app.jwt.refreshTtlSeconds=604800

# AI Configuration
gemini.api.key=AIzaSyBO4wKZ_bpgEn4d8GyGhWeMDISwmHE1E40
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
```

## 🧪 Testing

### Postman Collection
Use the provided JWT tokens for testing:

**Teacher Token:**
```
eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVEVBQ0hFUiIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiJkZWVwYW5zaHVAZ21haWwuY29tIiwiaWF0IjoxNzU3ODU3MzcxLCJleHAiOjE3NTc5NDM3NzF9.p4TB08h3CfGx1ylw8-UzRCx-QNdFG0SYgQc0dT-54mI
```

**Student Token:**
```
eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiU1RVREVOVCIsInR5cGUiOiJhY2Nlc3MiLCJzdWIiOiJkZWVwYUBnbWFpbC5jb20iLCJpYXQiOjE3NTc4NTc0MTUsImV4cCI6MTc1Nzk0MzgxNX0.rzr0uN9ZbbXQTFIEFtxNoo4JvY3Qc3-gYN_c50d8Y5o
```

## 🎨 UI Features

### Design System
- **Theme**: Brutal/Neubrutalism design
- **Colors**: High contrast with bold borders
- **Typography**: Impact font for headers
- **Components**: Card-based layout with shadows

### Responsive Design
- Mobile-first approach
- Flexible grid system
- Touch-friendly interactions

## 🔒 Security Features

### Authentication Security
- JWT with RS256 signing
- Password hashing with BCrypt
- Token blacklisting on logout
- CORS protection

### Authorization
- Role-based endpoint protection
- Method-level security annotations
- Protected routes in frontend

## 🚀 Deployment

### Production Checklist
- [ ] Change JWT secret in production
- [ ] Configure production database
- [ ] Set up environment variables
- [ ] Enable HTTPS
- [ ] Configure logging
- [ ] Set up monitoring

## 📈 Future Enhancements

### Planned Features
- [ ] Real-time quiz sessions
- [ ] Video question support
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Bulk question import
- [ ] Quiz templates

## 🐛 Known Issues
- None currently identified

## 📞 Support
For technical support or questions, contact the development team.

---

**Last Updated**: September 14, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
