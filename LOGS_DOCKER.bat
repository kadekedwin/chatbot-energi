@echo off
echo.
echo ========================================
echo    VIEW ENERNOVA DOCKER LOGS
echo ========================================
echo.
echo Pilih log yang ingin dilihat:
echo.
echo 1. All Services (semua)
echo 2. Backend API
echo 3. Frontend
echo 4. PostgreSQL Database
echo 5. Exit
echo.
set /p choice="Pilih (1-5): "

if "%choice%"=="1" (
    docker-compose logs -f
) else if "%choice%"=="2" (
    docker-compose logs -f backend
) else if "%choice%"=="3" (
    docker-compose logs -f frontend
) else if "%choice%"=="4" (
    docker-compose logs -f postgres_db
) else if "%choice%"=="5" (
    exit /b 0
) else (
    echo Invalid choice
    pause
    exit /b 1
)
