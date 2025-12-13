# 🛠️ TROUBLESHOOTING GUIDE - EnerNova API

## ❌ Error: EADDRINUSE (Port 5000 sudah digunakan)

### **Gejala:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

### **Penyebab:**
Port 5000 masih digunakan oleh proses Node.js lain yang belum terminated.

### **Solusi:**

#### **Opsi 1: Gunakan Script Restart (RECOMMENDED)**
```bash
cd api
restart.bat
```

Script ini akan:
1. ✅ Auto-detect proses di port 5000
2. ✅ Kill proses tersebut
3. ✅ Restart server dengan nodemon

---

#### **Opsi 2: Manual Kill Process**

**Step 1: Cari PID (Process ID)**
```bash
netstat -ano | findstr ":5000" | findstr "LISTENING"
```

Output contoh:
```
TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    3472
```
PID = **3472**

**Step 2: Kill Process**
```bash
taskkill /F /PID 3472
```

**Step 3: Restart Server**
```bash
cd api
pnpm dev
```

---

#### **Opsi 3: Kill Semua Node.js Processes**
```bash
taskkill /F /IM node.exe
```
⚠️ **Warning**: Ini akan mematikan SEMUA proses Node.js, termasuk frontend!

---

#### **Opsi 4: Gunakan Port Berbeda**

Edit `api/.env`:
```env
PORT=5001
```

Lalu update `chatbot-energi/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

## 🔍 Verificasi Server Running

### **Test 1: Health Check**
```bash
curl http://localhost:5000/api/health
```

**Expected Output**:
```json
{
  "status": "healthy",
  "uptime": 13.21,
  "memory": { ... },
  "timestamp": "2025-12-10T12:28:16.235Z"
}
```

### **Test 2: Check Port**
```bash
netstat -ano | findstr ":5000"
```

**Expected Output**:
```
TCP    0.0.0.0:5000     0.0.0.0:0    LISTENING    12345
TCP    [::]:5000        [::]:0       LISTENING    12345
```

### **Test 3: Login Test**
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@enernova.id\",\"password\":\"admin123\"}"
```

**Expected**: JSON response dengan token

---

## 🚫 Error: Cannot Connect to Server

### **Penyebab:**
1. Server belum selesai starting
2. Firewall blocking
3. Server crash setelah start

### **Solusi:**

**1. Tunggu Server Init**
```bash
timeout /t 3 /nobreak
curl http://localhost:5000/api/health
```

**2. Check Server Logs**
```bash
cd api
node server.js
```

Lihat output untuk error messages.

**3. Check Firewall**
```bash
netsh advfirewall firewall show rule name=all | findstr 5000
```

**4. Restart dengan Verbose Logging**
Edit `api/.env`:
```env
NODE_ENV=development
LOG_LEVEL=debug
```

---

## 📦 Error: Module Not Found

### **Axios Missing**
```bash
cd chatbot-energi
pnpm add axios
```

### **Prisma Client Missing**
```bash
cd api
pnpm install
npx prisma generate
```

### **Dependencies Corrupt**
```bash
# Frontend
cd chatbot-energi
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Backend
cd api
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 🔐 Error: Invalid API Key

### **Groq API**
**Gejala**: `Groq API key is invalid or missing`

**Solusi**: Check `api/.env`
```env
GROQ_API_KEY=gsk_XXXXXXXXXXXXXXXXXXXXXX
```

**Get New Key**: https://console.groq.com/keys

---

## 💾 Error: Database Connection Failed

### **SQLite File Missing**
```bash
cd api
npx prisma migrate dev --name init
npx prisma generate
node prisma/seed.js
```

### **Prisma Schema Mismatch**
```bash
cd api
npx prisma migrate reset
node prisma/seed.js
```

---

## 🌐 Error: CORS

### **Gejala:**
Frontend tidak bisa akses backend, error di console browser:
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:3002' has been blocked by CORS policy
```

### **Solusi:**

Check `api/.env`:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002
```

Atau edit `api/server.js`:
```javascript
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'http://localhost:3002',
  'http://localhost:3001'
];
```

---

## 🔄 Auto-Restart Not Working (Nodemon)

### **Solusi 1: Manual Restart**
Di terminal nodemon, ketik:
```
rs
```

### **Solusi 2: Check nodemon.json**
Create `api/nodemon.json`:
```json
{
  "watch": ["*.js", "controllers", "routes", "middleware"],
  "ext": "js,json",
  "ignore": ["node_modules", "logs"],
  "delay": "1000"
}
```

### **Solusi 3: Gunakan npm script**
```bash
cd api
pnpm dev
```

---

## 📱 Frontend Not Loading

### **Error: ELIFECYCLE**
```bash
cd chatbot-energi
taskkill /F /IM node.exe
pnpm dev
```

### **Port 3000/3001/3002 In Use**
Frontend akan auto-switch ke port berikutnya.

Check output:
```
⚠ Port 3000 is in use, trying 3001 instead.
- Local:        http://localhost:3002
```

---

## 🧪 Complete Health Check Script

Buat `test-system.bat`:
```batch
@echo off
echo ========================================
echo 🧪 EnerNova System Health Check
echo ========================================
echo.

echo 1️⃣ Testing Backend Health...
curl http://localhost:5000/api/health
echo.
echo.

echo 2️⃣ Testing Login...
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@enernova.id\",\"password\":\"admin123\"}"
echo.
echo.

echo 3️⃣ Testing Chat (Hybrid RAG)...
curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d "{\"message\":\"test\"}"
echo.
echo.

echo 4️⃣ Testing Frontend...
curl http://localhost:3002
echo.
echo.

echo ========================================
echo ✅ Health Check Complete!
echo ========================================
pause
```

---

## 📞 Quick Reference

### **Start Backend**
```bash
cd api
pnpm dev
```

### **Start Frontend**
```bash
cd chatbot-energi
pnpm dev
```

### **Restart Everything**
```bash
# Kill all node processes
taskkill /F /IM node.exe

# Start backend
cd api
pnpm dev

# Start frontend (new terminal)
cd chatbot-energi
pnpm dev
```

### **Emergency Reset**
```bash
# Backend
cd api
rm -rf node_modules pnpm-lock.yaml
pnpm install
npx prisma migrate reset
node prisma/seed.js

# Frontend
cd chatbot-energi
rm -rf node_modules pnpm-lock.yaml .next
pnpm install
```

---

## 🆘 Still Having Issues?

### **Check Logs**
- Backend: `api/logs/combined.log`
- Backend Errors: `api/logs/error.log`
- Frontend: Terminal output

### **Check Versions**
```bash
node --version    # Should be >= 18
pnpm --version    # Should be >= 8
```

### **Check Environment**
```bash
# Backend
cd api
cat .env

# Frontend
cd chatbot-energi
cat .env.local
```

---

## ✅ Working State Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3002
- [ ] Health endpoint responds
- [ ] Login works
- [ ] Chat responds (< 3s)
- [ ] No CORS errors in browser console
- [ ] Database has 3 users, 3 journals

---

**Last Updated**: December 10, 2025  
**Status**: Production Ready ✅
