@echo off
echo.
echo ======================================================
echo    ENERNOVA - AI CHATBOT ENERGI TERBARUKAN
echo ======================================================
echo.
echo 🚀 MEMULAI PROJECT...
echo.

:: Cek apakah backend sudah running
netstat -ano | findstr ":5000" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend sudah running di port 5000
) else (
    echo 🔄 Memulai Backend API...
    start "EnerNova Backend" cmd /k "cd api && pnpm dev"
    timeout /t 3 /nobreak >nul
)

:: Cek apakah frontend sudah running
netstat -ano | findstr ":3000" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend sudah running di port 3000
) else (
    echo 🔄 Memulai Frontend Next.js...
    start "EnerNova Frontend" cmd /k "pnpm dev"
    timeout /t 5 /nobreak >nul
)

echo.
echo ======================================================
echo    ✅ PROJECT BERHASIL DIJALANKAN!
echo ======================================================
echo.
echo 📍 URL:
echo    Backend:  http://localhost:5000
echo    Frontend: http://localhost:3000
echo    Login:    http://localhost:3000/login
echo.
echo 🔐 KREDENSIAL DEMO:
echo    ADMIN:        admin@enernova.id / admin123
echo    KONTRIBUTOR:  kontributor@enernova.id / kontributor123
echo    RESEARCHER:   peneliti@enernova.id / peneliti123
echo.
echo 💡 CARA MENGGUNAKAN:
echo    1. Buka browser: http://localhost:3000/login
echo    2. Klik salah satu tombol "Demo Login"
echo    3. Klik "Masuk ke Platform"
echo    4. Dashboard akan otomatis terbuka!
echo.
echo ⚡ FITUR UTAMA:
echo    ✅ Login dengan 3 Role (Admin, Kontributor, User)
echo    ✅ Dashboard Admin (Manage Journals)
echo    ✅ AI Chat dengan Groq LLaMA 3.3 70B
echo    ✅ Hybrid RAG (Database + AI)
echo    ✅ Upload Multiple Journals
echo    ✅ Real-time Statistics
echo.
echo 🛑 Untuk STOP project:
echo    - Tutup window Backend dan Frontend
echo    - Atau tekan Ctrl+C di masing-masing window
echo.
echo ======================================================
pause
