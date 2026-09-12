@echo off
set "PATH=%USERPROFILE%\mingit\cmd;%PATH%"
cd /d "%~dp0"
echo ========================================================
echo   Pushing ApnaKona to GitHub
echo   Target: https://github.com/arshad-mohammad98/ApnaKona.git
echo ========================================================
echo.
git branch -M main
git add -A
git commit -m "feat: ApnaKona student housing portal updates"
echo.
echo If prompted:
echo   - Username: arshad-mohammad98 (or your GitHub username)
echo   - Password: Your GitHub Personal Access Token (PAT)
echo.
git push -u origin main --force
echo.
pause
