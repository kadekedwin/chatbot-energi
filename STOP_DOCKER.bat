@echo off
echo.
echo ========================================
echo    STOP ENERNOVA DOCKER CONTAINERS
echo ========================================
echo.

docker-compose down

if %errorlevel% equ 0 (
    echo.
    echo ✅ Semua containers berhasil dihentikan
    echo.
) else (
    echo.
    echo ❌ Error saat menghentikan containers
    echo.
)

pause
