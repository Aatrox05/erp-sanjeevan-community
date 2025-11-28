@echo off
REM ERP Sanjeevan Quick Start Script for Windows

echo.
echo ========================================
echo   ERP Sanjeevan - Quick Start
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed or not in PATH
    echo Please install Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [1/4] Starting MongoDB containers...
docker-compose up -d
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start Docker containers
    pause
    exit /b 1
)

echo [2/4] Waiting for MongoDB to be ready... (30 seconds)
timeout /t 30 /nobreak

echo [3/4] Starting Backend Server...
start cmd /k "cd backend && npm run dev"

echo [4/4] Starting Frontend Server...
start cmd /k "npm run dev"

echo.
echo ========================================
echo   ✅ ERP Sanjeevan is Starting!
echo ========================================
echo.
echo Frontend: http://localhost:3000/ERP_sanjeevan/
echo Backend:  http://localhost:5000/health
echo MongoDB:  mongodb://localhost:27017
echo Mongo Express: http://localhost:8081
echo.
echo Press any key to close this window...
pause

