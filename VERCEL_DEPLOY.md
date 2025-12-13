# 🌐 VERCEL DEPLOYMENT - STEP BY STEP

## Prerequisites
✅ Vercel account (https://vercel.com)  
✅ Railway backend deployed (previous step)  
✅ Backend URL ready

---

## Step 1: Install Vercel CLI

```bash
npm install -g vercel
vercel login
```

Follow browser auth flow.

---

## Step 2: Create Environment File

```bash
cd chatbot-energi
```

Create `.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

**Important:** Replace with your actual Railway URL!

---

## Step 3: Update .gitignore

Ensure `.env.production` is in `.gitignore`:
```gitignore
.env*.local
.env.production
```

---

## Step 4: Test Local Production Build

```bash
npm run build
npm start

# Open: http://localhost:3000
# Test login works
```

---

## Step 5: Deploy to Vercel

```bash
vercel

# Follow prompts:
# ✓ Set up and deploy? Yes
# ✓ Which scope? Your Account
# ✓ Link to existing project? No
# ✓ Project name? enernova
# ✓ Directory? ./
# ✓ Override settings? No
```

---

## Step 6: Set Production Environment Variables

**Option A: Via Dashboard**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend.railway.app`
   - Environment: Production ✓

**Option B: Via CLI**
```bash
vercel env add NEXT_PUBLIC_API_URL production
# Paste your Railway URL when prompted
```

---

## Step 7: Deploy to Production

```bash
vercel --prod

# Or push to GitHub main branch (auto-deploy)
git push origin main
```

---

## Step 8: Update Backend CORS

```bash
# In Railway dashboard → Variables:
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-main.vercel.app

# Or via CLI:
railway variables set ALLOWED_ORIGINS=https://your-app.vercel.app

# Redeploy backend:
railway up
```

---

## Step 9: Test Production

```bash
# Open your Vercel URL
open https://your-app.vercel.app/login

# Test:
# 1. Login page loads
# 2. Click "Demo Admin"
# 3. Login: admin@enernova.id / admin123
# 4. Dashboard loads journals from Railway API
# 5. Approve/Reject works
```

---

## Step 10: Configure Custom Domain (Optional)

**Via Dashboard:**
1. Project → Settings → Domains
2. Add domain: `enernova.id`
3. Update DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

**Via CLI:**
```bash
vercel domains add enernova.id
```

---

## ✅ Frontend Deployed!

**URL:** https://your-app.vercel.app  
**Login:** https://your-app.vercel.app/login  
**Dashboard:** https://your-app.vercel.app/admin/dashboard

---

## 🔄 Update Deployment

```bash
# Option 1: Push to GitHub
git add .
git commit -m "Update feature"
git push

# Option 2: Manual deploy
vercel --prod
```

---

## 📊 Monitor

**Logs:**
```bash
vercel logs

# Or in dashboard:
# Project → Deployments → View Function Logs
```

**Analytics:**
Vercel Dashboard → Analytics tab

---

## 🐛 Troubleshooting

### CORS error in browser:
**Fix:** Update Railway `ALLOWED_ORIGINS` to include Vercel URLs

### API not reachable:
**Check:**
1. `NEXT_PUBLIC_API_URL` set correctly in Vercel
2. Railway backend is running
3. Open browser DevTools → Network tab

### Environment variable not working:
**Fix:**
1. Must prefix with `NEXT_PUBLIC_` for client-side
2. Redeploy after adding variable:
   ```bash
   vercel --prod
   ```

### Build fails:
**Check:**
1. `npm run build` works locally
2. Check build logs in Vercel dashboard
3. Ensure all dependencies in package.json

---

## 🎯 Success Checklist

- [ ] Vercel deployment successful
- [ ] Production URL accessible
- [ ] Login page loads
- [ ] Can login with admin credentials
- [ ] Dashboard shows journals from Railway API
- [ ] Approve/Reject buttons work
- [ ] No CORS errors in console
- [ ] No 404 errors in Network tab

---

## 🔐 Security

**Post-Deployment:**
1. Remove all `console.log` statements
2. Enable Vercel Analytics
3. Set up error tracking (Sentry)
4. Configure CSP headers
5. Enable Vercel Firewall (Pro)

---

**Backend:** ✅ Deployed on Railway  
**Frontend:** ✅ Deployed on Vercel  
**Full Stack:** ✅ Production Ready!

**Next:** Part C - Mobile App Development →

