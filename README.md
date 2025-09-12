# 🎯 QUIZ PLATFORM - Full Stack Educational Platform

A complete educational platform built with **Spring Boot** backend and **React** frontend, featuring JWT authentication, real-time updates, and role-based dashboards.

## 🚀 Quick Start (One Command)

### Windows PowerShell:
```powershell
# Terminal 1: Start Backend
cd backend
mvn spring-boot:run

# Terminal 2: Start Frontend  
cd frontend
npm run dev
```

### Linux/Mac:
```bash
# Terminal 1: Start Backend
cd backend && mvn spring-boot:run

# Terminal 2: Start Frontend
cd frontend && npm run dev
```

## 🌐 Access URLs
- **Frontend**: http://localhost:5173
- **Gateway**: http://localhost:8080 (planned)
- **Backend API (current)**: http://localhost:8081
- **Database**: MySQL `quiz_db`

## 🗄️ Database Setup
```bash
# Create database and tables
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

**Database Name**: `quiz_db`

## 🔐 Test Credentials
- **Teacher**: `alice@example.com` / `Passw0rd!`
- **Student**: `bob@example.com` / `Passw0rd!`

## 🧪 Test JWT API
```bash
# Login to get JWT token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Passw0rd!"}'

# Use token in Authorization header
curl -X GET http://localhost:8080/api/quiz \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🏗️ Architecture

### Backend (Spring Boot)
- **Port**: 8080
- **Database**: MySQL with JPA
- **Security**: JWT Authentication
- **Real-time**: WebSocket (STOMP)
- **API**: RESTful endpoints

### Frontend (React + Vite)
- **Port**: 5173
- **Theme**: Brutalist design
- **State**: Context API
- **HTTP**: Axios with JWT
- **Real-time**: WebSocket client

## 📋 Features

### 🔐 Authentication
- JWT-based login/signup
- Role-based access (TEACHER/STUDENT)
- Secure password hashing (BCrypt)

### 👨‍🏫 Teacher Dashboard
- Create/manage quizzes (Easy/Medium/Hard)
- View student list and performance
- Analytics and quiz statistics
- Real-time student activity

### 👨‍🎓 Student Dashboard  
- Attempt available quizzes
- View past results and scores
- Live leaderboard updates
- Performance tracking

### ⚡ Real-time Features
- Live leaderboard updates
- WebSocket notifications
- Real-time quiz status

## 🛠️ Tech Stack

### Backend
- Spring Boot 3.3.3
- Spring Security (JWT)
- Spring Data JPA
- MySQL Database
- WebSocket (STOMP)
- Maven Build

### Frontend
- React 18 + TypeScript
- Vite Build Tool
- Axios HTTP Client
- STOMP WebSocket Client
- Brutalist CSS Theme

## 📁 Project Structure
```
quiz/
├── backend/                 # Spring Boot API
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Config files
│   └── pom.xml            # Maven dependencies
├── frontend/               # React application
│   ├── src/               # React source code
│   ├── package.json       # npm dependencies
│   └── vite.config.ts     # Vite configuration
├── database/              # SQL scripts
│   ├── schema.sql         # Database schema
│   └── seed.sql          # Sample data
└── README.md             # This file
```

## 🔧 Configuration

### Backend Configuration (`application.properties`)
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/quiz_db
spring.datasource.username=root
spring.datasource.password=your_password

# JWT
app.jwt.secret=my-super-secret-jwt-key-for-quiz-platform-2024-secure-key
app.jwt.ttlSeconds=86400

# Server
server.port=8080
```

### Frontend Configuration (`vite.config.ts`)
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
})
```

## 🚨 Troubleshooting

### Backend Issues
- **JWT Errors**: Check `app.jwt.secret` in `application.properties`
- **Database Connection**: Verify MySQL is running and credentials are correct
- **Port Conflicts**: Change `server.port` if 8080 is occupied

### Frontend Issues  
- **API Connection**: Ensure backend is running on port 8080
- **Build Errors**: Run `npm install` to install dependencies
- **Port Conflicts**: Change port in `vite.config.ts` if 5173 is occupied

### Database Issues
- **Connection Failed**: Check MySQL service is running
- **Table Errors**: Re-run `schema.sql` and `seed.sql`
- **Permission Denied**: Verify MySQL user permissions

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration  
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Quiz Management
- `GET /api/quiz` - List all quizzes
- `POST /api/quiz` - Create new quiz
- `DELETE /api/quiz/{id}` - Delete quiz

### Quiz Attempts
- `POST /api/attempt` - Submit quiz attempt
- `GET /api/attempt/my` - Get user's attempts

### Analytics
- `GET /api/analytics/summary` - Quiz statistics
- `GET /api/analytics/students` - Student performance
- `GET /api/analytics/attempts` - All attempts

## 🎨 UI Features
- **Brutalist Design**: Bold typography, high contrast
- **Responsive Layout**: Works on desktop and mobile
- **Dark Theme**: Professional appearance
- **Real-time Updates**: Live data without refresh

## 🔒 Security Features
- JWT token authentication
- Password hashing with BCrypt
- Role-based authorization
- CORS configuration
- Input validation

## 📈 Performance
- Optimized database queries
- Efficient state management
- Real-time WebSocket updates
- Responsive UI components

---

## 🎯 **READY TO USE!**

1. **Start Backend**: `cd backend && mvn spring-boot:run`
2. **Start Frontend**: `cd frontend && npm run dev`  
3. **Open Browser**: http://localhost:5173
4. **Login**: Use `alice@example.com` / `Passw0rd!`

**Your Quiz Platform is now running! 🚀**