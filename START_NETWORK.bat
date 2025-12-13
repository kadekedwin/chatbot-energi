@echo off
echo.
echo ======================================================
echo    ENERNOVA - NETWORK ACCESS MODE
echo ======================================================
echo.
echo 🌍 Memulai server dengan akses network...
echo.

:: Get IP Address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address" ^| findstr /v "192.168.56" ^| findstr /v "172."') do (
    set IP=%%a
    goto :ip_found
)
:ip_found
set IP=%IP:~1%
echo 📡 IP Address: %IP%
echo.

:: Kill existing Node processes
echo 🔄 Menghentikan proses yang sedang berjalan...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

:: Start Backend
echo 🚀 Memulai Backend API...
start "EnerNova Backend API" cmd /k "cd api && node server.js"
timeout /t 5 /nobreak >nul

:: Start Frontend
echo 🎨 Memulai Frontend...
start "EnerNova Frontend" cmd /k "set HOST=0.0.0.0 && npm run dev"
timeout /t 10 /nobreak >nul

echo.
echo ======================================================
echo    ✅ SERVER BERHASIL DIJALANKAN!
echo ======================================================
echo.
echo 🔗 Akses dari komputer ini:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo.
echo 🌍 Akses dari device lain (HP/Tablet/Laptop lain):
echo    Frontend: http://%IP%:3000
echo    Backend:  http://%IP%:5000
echo.
echo 📱 Scan QR Code di HP untuk akses langsung
echo.
echo ⚠️  PENTING: Pastikan firewall mengizinkan port 3000 dan 5000
echo     Atau matikan Windows Firewall sementara untuk testing
echo.
echo 🛑 Tekan Ctrl+C untuk menghentikan server
echo ======================================================
echo.
pause
