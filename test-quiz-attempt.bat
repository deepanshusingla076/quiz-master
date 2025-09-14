@echo off
setlocal EnableDelayedExpansion
echo Testing quiz attempt functionality...

:: 1. Create a test user (if needed)
echo Creating test user...
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test Student\",\"email\":\"test@example.com\",\"password\":\"password\",\"role\":\"STUDENT\"}"

:: 2. Login to get JWT token
echo.
echo Logging in...
for /f "tokens=2 delims=:" %%a in ('curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password\"}" ^| findstr /C:"token"') do (
    set TOKEN=%%a
    set TOKEN=!TOKEN:"=!
    set TOKEN=!TOKEN:,=!
    set TOKEN=!TOKEN: =!
)

echo Token: %TOKEN%

:: 3. Get available quizzes
echo.
echo Getting available quizzes...
curl -X GET http://localhost:8080/api/quiz/available ^
  -H "Authorization: Bearer %TOKEN%"

:: 4. Get questions for the first quiz (assuming quiz ID 1 exists)
echo.
echo Getting questions for quiz ID 1...
curl -X GET http://localhost:8080/api/quiz/1/questions ^
  -H "Authorization: Bearer %TOKEN%"

:: 5. Submit an attempt with answers
echo.
echo Submitting quiz attempt...
curl -X POST http://localhost:8080/api/attempts ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{
    \"quizId\": 1,
    \"answers\": [
      {\"questionId\": 1, \"optionId\": 0},
      {\"questionId\": 2, \"optionId\": 1},
      {\"questionId\": 3, \"optionId\": 2}
    ]
  }"

:: 6. Get user's attempts
echo.
echo Getting user's attempts...
curl -X GET http://localhost:8080/api/attempts/mine ^
  -H "Authorization: Bearer %TOKEN%"

echo.
echo Test completed!
pause