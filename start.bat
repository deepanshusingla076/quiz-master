@echo off
title Quiz Master - Simple Start

echo ====================================================
echo Quiz Master - Simple Start Script
echo ====================================================

echo Starting all services...
echo.

echo Starting Eureka Service Registry...
start "Eureka Server" cmd /k "cd microservices\eureka-server && mvn spring-boot:run"

echo Waiting 30 seconds for Eureka to start...
ping 127.0.0.1 -n 31 >nul

echo Starting API Gateway...
start "API Gateway" cmd /k "cd microservices\api-gateway && mvn spring-boot:run"

echo Waiting 20 seconds...
ping 127.0.0.1 -n 21 >nul

echo Starting Auth Service...
start "Auth Service" cmd /k "cd microservices\auth-service && mvn spring-boot:run"

echo Waiting 15 seconds...
ping 127.0.0.1 -n 16 >nul

echo Starting Question Bank Service...
start "Question Bank Service" cmd /k "cd microservices\question-bank-service && mvn spring-boot:run"

echo Waiting 15 seconds...
ping 127.0.0.1 -n 16 >nul

echo Starting Result Service...
start "Result Service" cmd /k "cd microservices\result-service && mvn spring-boot:run"

echo Starting AI Service...
start "AI Service" cmd /k "cd microservices\ai-service && mvn spring-boot:run"

echo Waiting 15 seconds...
ping 127.0.0.1 -n 16 >nul

echo Starting React Frontend...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ====================================================
echo All services starting!
echo ====================================================
echo.
echo Services will be available at:
echo Eureka Dashboard: http://localhost:8761
echo Main Application: http://localhost:5173
echo.
echo Opening browser in 10 seconds...
ping 127.0.0.1 -n 11 >nul

start http://localhost:5173
start http://localhost:8761

echo.
echo Quiz Master is starting!
echo Wait 2-3 minutes for all services to fully load.
echo.
pause