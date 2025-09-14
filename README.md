# 🎯 QUIZ PLATFORM - Simple & Clean

A modern, easy-to-use quiz platform built with **Spring Boot** and **React**. Perfect for educational institutions and training programs.

## 🚀 Quick Start

### Option 1: One-Click Start (Recommended)
```bash
# Run this single command to start everything
.\start-dev.bat
```

### Option 2: Manual Start
```bash
# Terminal 1: Start Registry
cd registry && mvn spring-boot:run

# Terminal 2: Start Backend  
cd backend && mvn spring-boot:run

# Terminal 3: Start Frontend
cd frontend && npm run dev
```

## 🌐 Access URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Registry**: http://localhost:8761

## 🔑 Test Credentials
- **Teacher**: `alice@example.com` / `Passw0rd!`
- **Student**: `bob@example.com` / `Passw0rd!`

## ✨ Features

### 👨‍🏫 Teacher Dashboard
- **Create Quizzes**: Easy quiz creation with difficulty levels
- **Question Management**: Simple one-by-one question editor
- **AI Generation**: Generate questions automatically (mock data)
- **Analytics**: View student performance and quiz statistics
- **Student Management**: Track all student activities

### 👨‍🎓 Student Dashboard
- **Take Quizzes**: Attempt available quizzes
- **View Results**: See your scores and performance
- **Leaderboard**: Check rankings with other students

## 🎨 UI Features
- **Modern Design**: Clean, professional interface
- **Responsive**: Works on desktop and mobile
- **Easy Navigation**: Intuitive question management
- **Real-time Updates**: Live data without refresh

## 🛠️ Tech Stack

### Backend
- Spring Boot 3.3.3
- Spring Security (JWT)
- Spring Data JPA
- MySQL Database
- Maven Build

### Frontend
- React 18 + TypeScript
- Vite Build Tool
- Axios HTTP Client
- Modern CSS

## 📁 Project Structure
```
quiz-master/
├── backend/                 # Spring Boot API
├── frontend/               # React application
├── registry/               # Eureka Service Registry
├── gateway/                # API Gateway
├── database/               # SQL scripts
├── set.bat                # Setup script
└── start-dev.bat          # Development start script
```

## 🔧 Configuration

### Database Setup
```bash
# Create database and tables
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### JWT Secret Key
The JWT secret is automatically configured for development. For production:
```bash
# Set environment variable
set APP_JWT_SECRET=your-super-secure-key-here
```

## 🎯 Question Management Made Easy

### For Teachers:
1. **Create Quiz**: Enter title and select difficulty
2. **Add Questions**: Click "Edit Questions" on any quiz
3. **Simple Editor**: Navigate through questions one by one
4. **AI Generation**: Click "Generate with AI" for sample questions
5. **Save**: All questions are saved automatically

### Key Improvements:
- ✅ **One-by-one editing**: No more complex forms
- ✅ **Navigation buttons**: Previous/Next question
- ✅ **Visual feedback**: Clear question counter
- ✅ **Easy options**: Simple radio buttons for correct answers
- ✅ **AI Integration**: Generate questions instantly
- ✅ **Error handling**: Graceful fallbacks

## 🚨 Troubleshooting

### Common Issues:
1. **Port conflicts**: Change ports in application.properties
2. **Database connection**: Ensure MySQL is running
3. **Frontend not loading**: Run `npm install` in frontend folder
4. **API errors**: Check backend logs for details

### Quick Fixes:
```bash
# Reinstall frontend dependencies
cd frontend && npm install

# Rebuild backend
cd backend && mvn clean compile

# Reset database
mysql -u root -p < database/schema.sql
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user

### Quiz Management
- `GET /api/quiz` - List all quizzes
- `POST /api/quiz` - Create new quiz
- `DELETE /api/quiz/{id}` - Delete quiz
- `GET /api/quiz/{id}/questions` - Get quiz questions
- `PUT /api/quiz/{id}/questions` - Save quiz questions

### Quiz Attempts
- `POST /api/attempt` - Submit quiz attempt
- `GET /api/attempt/my` - Get user's attempts

## 🎉 Ready to Use!

1. **Start**: Run `.\start-dev.bat`
2. **Open**: http://localhost:5173
3. **Login**: Use test credentials
4. **Create**: Start making quizzes!

**Your Quiz Platform is now running perfectly! 🚀**