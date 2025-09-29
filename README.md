# 🎯 Quiz Master - Microservices Architecture

A comprehensive online quiz application built with modern microservices architecture, featuring role-based dashboards, group management, and enterprise-grade security.

## 🏗️ Architecture Overview

Quiz Master implements a complete microservices ecosystem with:

- **🔍 Service Discovery**: Netflix Eureka for dynamic service registration
- **🛡️ API Gateway**: Centralized routing with JWT validation
- **🔐 Authentication Service**: Secure user management with JWT tokens
- **📝 Question Bank Service**: Quiz and question management with group assignment
- **📊 Result Service**: Attempt tracking and result publication control
- **⚛️ React Frontend**: Modern TypeScript-based user interface

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Node.js 18+

### 1. Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE quiz_platform;
USE quiz_platform;
SOURCE database/schema.sql;
```

### 2. Start Services (in order)
```bash
# 1. Eureka Server (Port 8761)
cd microservices/eureka-server && mvn spring-boot:run

# 2. API Gateway (Port 8080)
cd microservices/api-gateway && mvn spring-boot:run

# 3. Auth Service (Port 8081)
cd microservices/auth-service && mvn spring-boot:run

# 4. Question Bank Service (Port 8082)
cd microservices/question-bank-service && mvn spring-boot:run

# 5. Result Service (Port 8083)
cd microservices/result-service && mvn spring-boot:run

# 6. Frontend (Port 5173)
cd frontend && npm install && npm run dev
```

### 3. Access Application
- **Frontend**: http://localhost:5173
- **Eureka Dashboard**: http://localhost:8761
- **API Gateway**: http://localhost:8080

📖 **Detailed Setup**: See [MICROSERVICES_STARTUP_GUIDE.md](./MICROSERVICES_STARTUP_GUIDE.md)

## ✨ Features

### 👨‍🏫 Teacher Dashboard
- **Quiz Creation**: Create quizzes with multiple question types
- **Group Assignment**: Assign quizzes to specific student groups/sections
- **Attempt Monitoring**: View real-time student attempts
- **Result Control**: Manually publish/unpublish results
- **Analytics**: Track quiz performance and completion rates

### 👨‍🎓 Student Dashboard
- **Group-based Quizzes**: View quizzes assigned to your group
- **Single Attempt**: Enforced one-time quiz attempts
- **Live Timer**: Real-time countdown during quiz attempts
- **Auto-submit**: Automatic submission when time expires
- **Result History**: View published results and attempt history

### 🔧 System Features
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different permissions for teachers and students
- **Service Discovery**: Dynamic service registration with Eureka
- **Load Balancing**: Automatic load balancing across service instances
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Health Monitoring**: Built-in health checks for all services

## 🏛️ Microservices Architecture

### Service Communication Flow
```
Frontend (React) → API Gateway → Target Microservice
                      ↓
              JWT Validation Filter
                      ↓
           Route to appropriate service
```

### Services Overview

| Service | Port | Responsibility | Database Tables |
|---------|------|----------------|----------------|
| Eureka Server | 8761 | Service Registry & Discovery | - |
| API Gateway | 8080 | Routing & Security | - |
| Auth Service | 8081 | User Authentication | users |
| Question Bank Service | 8082 | Quiz Management | quizzes, questions, question_options |
| Result Service | 8083 | Attempt Tracking | attempts |

### API Endpoints

#### Auth Service (`/api/auth/`)
```
POST /signup    - User registration
POST /login     - User authentication  
GET  /profile   - Get user profile
```

#### Question Bank Service (`/api/questionbank/`)
```
GET    /quizzes           - List all quizzes
POST   /quizzes           - Create new quiz
GET    /quizzes/{id}      - Get quiz details
PUT    /quizzes/{id}      - Update quiz
DELETE /quizzes/{id}      - Delete quiz
GET    /quizzes/group/{group} - Get quizzes by group
```

#### Result Service (`/api/results/`)
```
POST   /attempts         - Submit quiz attempt
GET    /attempts         - List user attempts
GET    /attempts/{id}    - Get attempt details
PUT    /attempts/{id}/publish - Publish results
```

## 🗄️ Database Schema

The application uses a shared MySQL database with the following tables:

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('TEACHER', 'STUDENT') NOT NULL,
    group_section VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Quizzes Table
```sql
CREATE TABLE quizzes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    total_marks INT NOT NULL,
    time_limit INT NOT NULL,
    group_section VARCHAR(50) NOT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Questions & Attempts Tables
See [database/schema.sql](./database/schema.sql) for complete schema.

## 🛠️ Development Guide

### Adding New Features

1. **New API Endpoint**:
   - Add endpoint to appropriate service
   - Update API Gateway routes if needed
   - Add frontend API calls
   - Update this documentation

2. **New Microservice**:
   - Create Spring Boot project with Eureka Client
   - Configure unique service name
   - Add routes to API Gateway
   - Update startup guide

### Testing Strategy

1. **Unit Tests**: Each service has isolated unit tests
2. **Integration Tests**: Test service-to-service communication
3. **End-to-End Tests**: Full user workflow testing
4. **Performance Tests**: Load testing for scalability

### Environment Configuration

Services support multiple environments through Spring profiles:

- `application.properties` - Default configuration
- `application-dev.properties` - Development settings
- `application-prod.properties` - Production settings

## 📦 Project Structure

```
quiz-master/
├── microservices/
│   ├── eureka-server/          # Service Registry
│   ├── api-gateway/            # API Gateway with JWT
│   ├── auth-service/           # Authentication Service
│   ├── question-bank-service/  # Quiz Management
│   └── result-service/         # Result Management
├── frontend/                   # React TypeScript App
├── database/                   # SQL Schema & Scripts
├── docs/                       # Additional Documentation
└── README.md                   # This file
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Authorization**: Teacher/Student permissions
- **Password Hashing**: BCrypt password encoding  
- **CORS Configuration**: Controlled cross-origin access
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Parameterized queries

## 🚦 Monitoring & Health Checks

All services include:
- **Health Endpoints**: `/actuator/health`
- **Service Registration**: Automatic Eureka registration
- **Connection Monitoring**: Database and service connectivity
- **Error Handling**: Comprehensive exception management

## 📈 Scalability Features

- **Horizontal Scaling**: Multiple service instances
- **Load Balancing**: Eureka client-side load balancing
- **Service Discovery**: Dynamic service location
- **Stateless Design**: Services don't maintain session state
- **Database Connection Pooling**: Efficient resource usage

## 🐛 Troubleshooting

### Common Issues

1. **Service Registration Failures**
   - Verify Eureka server is running
   - Check service names are unique
   - Verify network connectivity

2. **JWT Token Issues**
   - Ensure Auth Service is running
   - Check token format and expiration
   - Verify CORS configuration

3. **Database Connection Problems**
   - Check MySQL server status
   - Verify database credentials
   - Ensure database schema exists

See [MICROSERVICES_STARTUP_GUIDE.md](./MICROSERVICES_STARTUP_GUIDE.md) for detailed troubleshooting.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Update documentation
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📞 Support

- **Email**: support@quizplatform.com
- **Documentation**: [/docs](./docs/)
- **Issues**: [GitHub Issues](../../issues)

## 🙏 Acknowledgments

- Spring Boot Team for the excellent framework
- Netflix for Eureka service discovery
- React team for the frontend framework
- Contributors and testers

---

**Built with ❤️ using modern microservices architecture**