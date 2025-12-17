@echo off
echo.
echo ========================================
echo    ENERNOVA - DOCKER DEPLOYMENT
echo ========================================
echo.

:: Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Desktop tidak berjalan!
    echo    Silakan jalankan Docker Desktop terlebih dahulu.
    echo.
    pause
    exit /b 1
)

echo ✅ Docker Desktop terdeteksi
echo.

:: Check if .env file exists
if not exist ".env" (
    echo 📝 File .env tidak ditemukan. Membuat dari template...
    copy .env.docker .env
    echo.
    echo ⚠️  PENTING: Edit file .env dan isi:
    echo    - GROQ_API_KEY dengan API key Anda
    echo    - JWT_SECRET dengan secret key yang aman
    echo.
    echo 💡 Generate JWT_SECRET dengan command:
    echo    node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
    echo.
    pause
)

echo 🔍 Checking environment variables...
findstr /C:"gsk_your_groq_api_key_here" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo ⚠️  WARNING: GROQ_API_KEY belum diisi di file .env!
    echo    AI Chat tidak akan berfungsi.
    echo.
    set /p continue="Tetap lanjutkan? (y/n): "
    if /i not "%continue%"=="y" exit /b 1
)

echo.
echo 🐳 Memulai Docker containers...
echo    Ini akan memakan waktu 2-3 menit pertama kali
echo.

:: Stop existing containers
echo 🛑 Menghentikan container lama (jika ada)...
docker-compose down

echo.
echo 🏗️  Building dan starting services...
docker-compose up -d --build

if %errorlevel% neq 0 (
    echo.
    echo ❌ Error saat menjalankan Docker!
    echo    Cek log dengan: docker-compose logs
    pause
    exit /b 1
)

echo.
echo ⏳ Menunggu services siap...
timeout /t 10 /nobreak >nul

echo.
echo ✅ Checking service status...
docker-compose ps

echo.
echo ========================================
echo    ✅ ENERNOVA BERHASIL DIJALANKAN!
echo ========================================
echo.
echo 🌐 Access URLs:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo    Health:   http://localhost:5000/api/health
echo.
echo 📱 From other devices (same network):
echo    Replace localhost with your IP address
echo.
echo 🔐 Default Login:
echo    Admin:       admin@enernova.id / admin123
echo    Kontributor: kontributor@enernova.id / kontributor123
echo    User:        peneliti@enernova.id / peneliti123
echo.
echo 📊 View logs:       docker-compose logs -f
echo 🛑 Stop services:   docker-compose down
echo 🔄 Restart:         docker-compose restart
echo.
echo 💡 Tip: Buka browser ke http://localhost:3000
echo.
pause

:: Open browser
start http://localhost:3000
