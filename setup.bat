@echo off
echo ========================================
echo Quiz Platform Setup Script
echo ========================================
echo.

echo Starting Quiz Platform...
echo.

echo [1/3] Starting Backend Server...
cd backend
start "Backend Server" cmd /k "mvn spring-boot:run"
echo Backend server starting in new window...
echo.

timeout /t 3 /nobreak > nul

echo [2/3] Starting Frontend Development Server...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"
echo Frontend server starting in new window...
echo.

timeout /t 2 /nobreak > nul

echo [3/3] Opening Application in Browser...
timeout /t 10 /nobreak > nul
start http://localhost:5173
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul
