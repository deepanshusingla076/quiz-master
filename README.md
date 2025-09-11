# QUIZ//PLATFORM

Full-stack educational platform with Spring Boot (backend) + React (frontend).

## Stack
- Backend: Spring Boot 3, Spring Security (JWT), JPA, MySQL, WebSockets (STOMP)
- Frontend: React + Vite + TypeScript, Axios, Router, brutalist CSS

## Prereqs
- Java 21
- Node 18+
- MySQL running locally

## Backend setup
1. Set JWT secret (required):
```bash
export APP_JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"
```
2. Configure DB credentials in `backend/src/main/resources/application.properties`.
3. Build:
```bash
cd backend
mvn package -DskipTests
```
4. Run:
```bash
cd backend
mvn spring-boot:run
```
- Server: `http://localhost:8080`
- WebSocket endpoint: `/ws` (STOMP/SockJS)

## Frontend setup
```bash
cd frontend
npm install
npm run dev
```
- App: `http://localhost:5173`
- API proxy: `/api` → `http://localhost:8080`

## Database setup
1. Run MySQL and execute:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

## Get JWT Token (Postman/API Testing)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Passw0rd!"}'
```
Copy the `token` from response and use as `Authorization: Bearer <token>`

## Features
- JWT authentication (login/signup) with roles: TEACHER, STUDENT
- Teacher dashboard: create/manage quizzes, students list, analytics
- Student dashboard: attempt quizzes, view results, live leaderboard

## Testing
```
cd backend
mvn test
```

## Notes
- This starter mocks scoring on attempts (randomized) for demo.
- JWT tokens are stored in localStorage and sent via Authorization header.
- Harden validation and add proper role guards for production.
