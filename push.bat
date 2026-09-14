@echo off
title ApnaKona - Push to GitHub
cd /d "%~dp0"

echo ==========================================================
echo   Pushing ApnaKona to GitHub: https://github.com/arshad-mohammad98/ApnaKona.git
echo ==========================================================
echo.

where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git is not installed or not in PATH!
    pause
    exit /b 1
)

git remote set-url origin https://github.com/arshad-mohammad98/ApnaKona.git
git add -A
git commit -m "feat: updates to ApnaKona student housing portal"
git push origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ==========================================================
    echo [SUCCESS] Successfully pushed to GitHub!
    echo ==========================================================
) else (
    echo.
    echo [ERROR] Push failed. Please verify your GitHub credentials.
)

pause
