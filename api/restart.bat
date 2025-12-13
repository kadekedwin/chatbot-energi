@echo off
echo 🔄 Restarting EnerNova API Server...
echo.

:: Kill process on port 5000
echo 1. Checking port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000" ^| findstr "LISTENING"') do (
    echo    Found process: %%a
    echo    Killing process...
    taskkill /F /PID %%a >nul 2>&1
)

:: Wait a moment
echo 2. Waiting for port to be released...
timeout /t 2 /nobreak >nul

:: Start server
echo 3. Starting server...
echo.
pnpm dev
