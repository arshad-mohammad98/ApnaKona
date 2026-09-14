@echo off
title ApnaKona - Student Housing Portal
cd /d "%~dp0"

echo ==========================================================
echo           ApnaKona -- Student Housing Portal
echo ==========================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check dependencies
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
)

:: Check env
if not exist ".env.local" (
    if exist ".env.example" (
        copy .env.example .env.local
        echo [INFO] Created .env.local from .env.example
    )
)

echo [INFO] Starting Next.js development server...
start http://localhost:3000
call npm run dev
pause
