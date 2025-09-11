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
1. Configure DB credentials in `backend/src/main/resources/application.properties`.
2. Build:
```
cd backend
mvn package -DskipTests
```
3. Run:
```
mvn spring-boot:run
```
- Server: `http://localhost:8080`
- WebSocket endpoint: `/ws` (STOMP/SockJS)

## Frontend setup
```
cd frontend
npm install
npm run dev
```
- App: `http://localhost:5173`
- API proxy: `/api` → `http://localhost:8080`

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
