# 🐳 DOCKER DEPLOYMENT GUIDE - ENERNOVA

## 📋 Prerequisites

- Docker Desktop installed
- Docker Compose installed
- 8GB RAM minimum
- 10GB free disk space

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Copy environment template
copy .env.docker .env

# Edit .env file and set:
# - JWT_SECRET (generate with: openssl rand -base64 32)
# - GROQ_API_KEY (get from https://console.groq.com)
```

### 2. Build and Run

```bash
# Build and start all services
docker-compose up --build

# Or run in background (detached mode)
docker-compose up -d --build
```

### 3. Wait for Services

Wait about 2-3 minutes for all services to be ready:
- Database initialization
- Prisma migrations
- Backend health checks
- Frontend build

### 4. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

### 5. Default Login

```
Email: admin@enernova.id
Password: admin123
```

## 🛠️ Useful Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres_db
```

### Check Status
```bash
# List running containers
docker-compose ps

# Check health status
docker ps
```

### Execute Commands
```bash
# Access backend shell
docker-compose exec backend sh

# Access frontend shell
docker-compose exec frontend sh

# Access PostgreSQL
docker-compose exec postgres_db psql -U enernova -d enernova_db
```

### Database Operations
```bash
# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npx prisma db seed

# Open Prisma Studio
docker-compose exec backend npx prisma studio
```

## 🛑 Stop and Cleanup

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (CAUTION: Deletes database!)
docker-compose down -v

# Complete cleanup
docker-compose down -v --rmi all --remove-orphans
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill the process or change port in docker-compose.yml
```

### Build Fails
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Database Connection Error
```bash
# Check if postgres is healthy
docker-compose ps

# Restart database
docker-compose restart postgres_db

# View database logs
docker-compose logs postgres_db
```

### Cannot Access Frontend
```bash
# Check if frontend is running
docker-compose ps frontend

# Check logs
docker-compose logs frontend

# Restart frontend
docker-compose restart frontend
```

## 📊 Monitoring

### Resource Usage
```bash
# View real-time stats
docker stats

# View disk usage
docker system df
```

### Container Inspection
```bash
# Inspect backend
docker inspect enernova_backend

# View all containers
docker ps -a

# View volumes
docker volume ls

# View networks
docker network ls
```

## 🔒 Security Notes

### Production Deployment

1. **Change Default Passwords**
   - Update `POSTGRES_PASSWORD` in docker-compose.yml
   - Generate strong `JWT_SECRET`

2. **Environment Variables**
   - Never commit `.env` file
   - Use secrets management in production

3. **Network Security**
   - Use reverse proxy (Nginx/Traefik)
   - Enable HTTPS with SSL certificates
   - Configure firewall rules

4. **Database Backups**
   ```bash
   # Backup database
   docker-compose exec postgres_db pg_dump -U enernova enernova_db > backup.sql
   
   # Restore database
   docker-compose exec -T postgres_db psql -U enernova enernova_db < backup.sql
   ```

## 📈 Performance Tips

1. **Optimize Images**
   - Use multi-stage builds (already implemented)
   - Minimize layers
   - Use .dockerignore

2. **Resource Limits**
   Add to docker-compose.yml:
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '1.0'
             memory: 1G
   ```

3. **Volume Management**
   - Regular cleanup of unused volumes
   - Monitor disk usage
   - Use named volumes for important data

## 🎯 HKI Demo Instructions

**Single Command Deployment:**

```bash
# Clone repository
git clone <repository-url>
cd chatbot-energi

# Setup environment
copy .env.docker .env
# Edit .env and add GROQ_API_KEY

# Start application
docker-compose up --build

# Wait 2-3 minutes
# Open browser: http://localhost:3000
# Login with: admin@enernova.id / admin123
```

## ✅ Checklist Before Demo

- [ ] Docker Desktop running
- [ ] `.env` file configured with valid GROQ_API_KEY
- [ ] Ports 3000, 5000, 5432 available
- [ ] At least 8GB RAM available
- [ ] Internet connection for downloading images
- [ ] Browser ready at http://localhost:3000

## 📞 Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Verify all services running: `docker-compose ps`
3. Check health status: `docker ps`
4. Review troubleshooting section above

---

**Status: 🐳 DOCKER READY FOR HKI SUBMISSION**
