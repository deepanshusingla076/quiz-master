@echo off
echo ========================================
echo    QUIZ PLATFORM - CLEANUP SCRIPT
echo ========================================
echo.

echo Removing build artifacts and temporary files...

REM Remove target directories
IF EXIST "gateway\target" (
    echo Removing gateway\target directory...
    rmdir /S /Q "gateway\target"
    echo Done.
) ELSE (
    echo gateway\target directory not found. Skipping.
)

IF EXIST "registry\target" (
    echo Removing registry\target directory...
    rmdir /S /Q "registry\target"
    echo Done.
) ELSE (
    echo registry\target directory not found. Skipping.
)

IF EXIST "backend\target" (
    echo Removing backend\target directory...
    rmdir /S /Q "backend\target"
    echo Done.
) ELSE (
    echo backend\target directory not found. Skipping.
)

REM Remove node_modules if needed
IF EXIST "frontend\node_modules" (
    echo Removing frontend\node_modules directory...
    rmdir /S /Q "frontend\node_modules"
    echo Done.
) ELSE (
    echo frontend\node_modules directory not found. Skipping.
)

echo.
echo ========================================
echo    CLEANUP COMPLETE
echo ========================================
echo.
echo Press any key to exit...
pause >nul