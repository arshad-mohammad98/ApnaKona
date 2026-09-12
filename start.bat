@echo off
cd /d "%~dp0"
echo Starting ApnaKona Application...
start http://localhost:3000
npm run dev
