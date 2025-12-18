# Quick Setup

## 1. Database & Backend
```bash
# Start Database
cd database
docker compose up -d

# Setup Schema & Seed
cd ../backend
npx prisma db push
node prisma/seed.js

# Run Backend
node server.js
```

## 2. Frontend
```bash
cd ../frontend
npm run dev
```

## Default Credentials
**Admin**: `admin@enernova.id` / `admin123`
**Contributor**: `kontributor@enernova.id` / `kontributor123`
