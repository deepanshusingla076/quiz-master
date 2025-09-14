# Setup Guide for New Laptop/Environment

## 🚀 Quick Setup for Running Quiz Platform on Another Laptop

This guide helps you set up the Quiz Platform project on a new laptop or environment.

## 📋 Prerequisites Installation

### 1. Install Java 21
```bash
# Download from Oracle or use package manager
# Windows: Download from https://www.oracle.com/java/technologies/downloads/
# Verify installation
java -version
```

### 2. Install Maven 3.6+
```bash
# Download from https://maven.apache.org/download.cgi
# Add to PATH environment variable
# Verify installation
mvn -version
```

### 3. Install MySQL 8.0
```bash
# Windows: Download MySQL Installer from https://dev.mysql.com/downloads/installer/
# During installation, set root password
# Start MySQL service: net start MySQL80
```

### 4. Install Node.js 18+
```bash
# Download from https://nodejs.org/
# Verify installation
node -version
npm -version
```

### 5. Install Git (if not already installed)
```bash
# Download from https://git-scm.com/downloads
git --version
```

## 🔧 Configuration Changes Required

### 1. Database Configuration
**File:** `backend/src/main/resources/application.properties`

**Change this line:**
```properties
spring.datasource.password=${DB_PASSWORD:Deepanshu@123ds}
```

**To your MySQL root password:**
```properties
spring.datasource.password=${DB_PASSWORD:YOUR_MYSQL_ROOT_PASSWORD}
```

### 2. Database Setup
```sql
-- MySQL will auto-create the database, but you can manually create it:
CREATE DATABASE quiz_db;
```

### 3. Environment Variables (Optional)
Instead of changing application.properties, you can set environment variables:

**Windows:**
```cmd
set DB_PASSWORD=your_mysql_password
set APP_JWT_SECRET=your-custom-jwt-secret-key
set GEMINI_API_KEY=your-gemini-api-key
```

**Linux/Mac:**
```bash
export DB_PASSWORD=your_mysql_password
export APP_JWT_SECRET=your-custom-jwt-secret-key
export GEMINI_API_KEY=your-gemini-api-key
```

## 🏃‍♂️ Step-by-Step Setup

### Step 1: Clone/Copy Project
```bash
# If using Git
git clone <repository-url>
cd quiz-master

# Or copy the project folder to your laptop
```

### Step 2: Backend Setup
```bash
cd backend

# Clean and install dependencies
mvn clean install

# Update application.properties with your MySQL password
# Edit: src/main/resources/application.properties
```

### Step 3: Database Setup
```bash
# Start MySQL service
net start MySQL80

# The application will auto-create tables on first run
```

### Step 4: Start Backend
```bash
# From backend directory
mvn spring-boot:run

# Wait for "Started QuizPlatformApplication" message
# Backend will run on http://localhost:8080
```

### Step 5: Frontend Setup
```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will run on http://localhost:5173
```

## ⚙️ Configuration Files to Modify

### 1. application.properties
**Location:** `backend/src/main/resources/application.properties`

**Required Changes:**
```properties
# Change this to your MySQL password
spring.datasource.password=${DB_PASSWORD:YOUR_PASSWORD_HERE}

# Optional: Change JWT secret for security
app.jwt.secret=${APP_JWT_SECRET:your-custom-secret-key}

# Optional: Add your own Gemini API key
gemini.api.key=${GEMINI_API_KEY:your-api-key}
```

### 2. No Frontend Changes Required
The frontend configuration should work as-is since it connects to localhost:8080.

## 🔍 Verification Steps

### 1. Check Backend is Running
```bash
# Test endpoint
curl http://localhost:8080/api/auth/signup
# Should return method not allowed (405) - this means server is running
```

### 2. Check Database Connection
```bash
# Look for this in backend logs:
# "HikariPool-1 - Start completed"
# "Started QuizPlatformApplication"
```

### 3. Check Frontend is Running
- Open browser: http://localhost:5173
- Should see Quiz Platform login page

### 4. Test Full Flow
1. Register a new teacher account
2. Login with credentials
3. Create a quiz
4. Register a student account
5. Take the quiz

## 🚨 Common Issues & Solutions

### Issue 1: MySQL Connection Failed
**Error:** `Access denied for user 'root'@'localhost'`

**Solution:**
```bash
# Reset MySQL root password or update application.properties
spring.datasource.password=your_actual_password
```

### Issue 2: Port 8080 Already in Use
**Error:** `Port 8080 was already in use`

**Solution:**
```bash
# Kill process using port 8080
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F

# Or change port in application.properties
server.port=8081
```

### Issue 3: Java Version Issues
**Error:** `Unsupported class file major version`

**Solution:**
```bash
# Ensure Java 21 is installed and set as JAVA_HOME
java -version
# Should show version 21.x.x
```

### Issue 4: Maven Dependencies Failed
**Error:** `Failed to execute goal`

**Solution:**
```bash
# Clear Maven cache and retry
mvn clean
mvn install -U
```

### Issue 5: Frontend Dependencies Failed
**Error:** `npm install failed`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📝 Default Credentials for Testing

After setup, you can create test accounts or use these if they exist:

**Teacher Account:**
- Email: teacher@example.com
- Password: password123
- Role: TEACHER

**Student Account:**
- Email: student@example.com
- Password: password123
- Role: STUDENT

## 🔐 Security Considerations for New Environment

### 1. Change Default Passwords
```properties
# Generate new JWT secret
app.jwt.secret=your-unique-secret-key-minimum-256-bits

# Use strong MySQL password
spring.datasource.password=strong_password_123
```

### 2. Environment Variables (Recommended)
Create `.env` file or set system environment variables instead of hardcoding in application.properties.

### 3. Database Security
```sql
-- Create dedicated database user instead of using root
CREATE USER 'quiz_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON quiz_db.* TO 'quiz_user'@'localhost';
FLUSH PRIVILEGES;
```

Then update application.properties:
```properties
spring.datasource.username=quiz_user
spring.datasource.password=secure_password
```

## 📁 Project Structure After Setup
```
quiz-master/
├── backend/                    # Spring Boot (Port 8080)
├── frontend/                   # React App (Port 5173)
├── docs/                      # Documentation
├── database/                  # SQL scripts
└── README.md
```

## ✅ Setup Completion Checklist

- [ ] Java 21 installed and verified
- [ ] Maven 3.6+ installed and verified
- [ ] MySQL 8.0 installed and running
- [ ] Node.js 18+ installed and verified
- [ ] Project cloned/copied to new laptop
- [ ] MySQL password updated in application.properties
- [ ] Backend dependencies installed (`mvn clean install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend running on http://localhost:8080
- [ ] Frontend running on http://localhost:5173
- [ ] Database connection successful
- [ ] Test user registration working
- [ ] Test quiz creation working

## 🆘 Getting Help

If you encounter issues:

1. Check the console logs for error messages
2. Verify all prerequisites are installed correctly
3. Ensure MySQL service is running
4. Check firewall settings for ports 8080 and 5173
5. Verify Java and Node.js versions match requirements

## 📞 Support Commands

**Check Running Services:**
```bash
# Check if backend is running
netstat -ano | findstr :8080

# Check if frontend is running
netstat -ano | findstr :5173

# Check MySQL service
net start | findstr MySQL
```

**Restart Services:**
```bash
# Restart MySQL
net stop MySQL80
net start MySQL80

# Restart backend (Ctrl+C then mvn spring-boot:run)
# Restart frontend (Ctrl+C then npm run dev)
```

---

**Setup Time:** ~30-45 minutes  
**Difficulty:** Beginner to Intermediate  
**Support:** Check logs and error messages for troubleshooting
