@echo off
setlocal EnableDelayedExpansion

REM Enable error handling

echo ========================================
echo    QUIZ PLATFORM - DEVELOPMENT START
echo ========================================
echo.

REM Check if required directories exist
echo Checking required directories...

set MISSING_DIR=0

if not exist "registry" (
    echo ERROR: Registry directory not found.
    set MISSING_DIR=1
)

if not exist "backend" (
    echo ERROR: Backend directory not found.
    set MISSING_DIR=1
)

if not exist "frontend" (
    echo ERROR: Frontend directory not found.
    set MISSING_DIR=1
)

if !MISSING_DIR! EQU 1 (
    echo.
    echo Please make sure you are running this script from the root directory of the project.
    goto :error
)

echo All required directories found.

echo Starting all services...
echo.

echo [1/4] Starting Registry Service...
start "Registry Service" cmd /k "cd registry && mvn spring-boot:run || (echo Registry service failed to start. Check logs for details. && pause && exit /b 1)"
echo Waiting for Registry Service to initialize...
timeout /t 10 /nobreak >nul

echo [2/4] Starting Backend Service...
start "Backend Service" cmd /k "cd backend && mvn spring-boot:run || (echo Backend service failed to start. Check logs for details. && pause && exit /b 1)"
echo Waiting for Backend Service to initialize...
timeout /t 15 /nobreak >nul

echo [3/4] Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev || (echo Frontend failed to start. Check for Node.js errors. && pause && exit /b 1)"
echo Waiting for Frontend to initialize...
timeout /t 5 /nobreak >nul

echo [4/4] Opening Browser...
start http://localhost:5173

echo.
echo ========================================
echo    ALL SERVICES STARTED!
echo ========================================
echo.
echo Services running on:
echo - Frontend: http://localhost:5173
echo - API Gateway: http://localhost:8080
echo - Backend: http://localhost:8081
echo - Registry: http://localhost:8761
echo.
echo Test credentials:
echo Teacher: alice@example.com / Passw0rd!
echo Student: bob@example.com / Passw0rd!
echo.
echo Press any key to exit...
goto :end

:error
echo.
echo ========================================
echo    ERROR STARTING SERVICES
echo ========================================
echo.
echo Please fix the errors above and try again.
echo If you need help, check the project documentation or contact support.
echo.
pause
exit /b 1

:end
echo Thank you for using Quiz Platform!
pause >nul
exit /b 0
