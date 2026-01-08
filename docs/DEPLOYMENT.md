# 🚀 Deployment Guide - Karteji PWA

Complete guide for deploying Karteji to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Deployment to Vercel](#deployment-to-vercel)
3. [Deployment to Netlify](#deployment-to-netlify)
4. [Self-Hosted Deployment](#self-hosted-deployment)
5. [Custom Domain Setup](#custom-domain-setup)
6. [Environment Configuration](#environment-configuration)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 1. Pre-Deployment Checklist

### Code Preparation

- [ ] All features tested locally
- [ ] No console errors or warnings
- [ ] All dependencies up to date
- [ ] Code linted and formatted
- [ ] Build succeeds without errors

```bash
# Run these checks
npm run lint
npm run build
npm run preview
```

### Assets & Branding

- [ ] Replace default logos with organization logos:
  - `public/pwa-64x64.png`
  - `public/pwa-192x192.png`
  - `public/pwa-512x512.png`
  - `public/maskable-icon-512x512.png`
  - `public/apple-touch-icon.png`

- [ ] Update organization info in `src/config/app.js`
- [ ] Set custom colors in `tailwind.config.js`
- [ ] Update app name in `vite.config.js` manifest

### Configuration

- [ ] Create production environment file
- [ ] Configure API endpoints (if backend ready)
- [ ] Set proper app name and description
- [ ] Configure analytics (optional)

---

## 2. Deployment to Vercel (Recommended)

### Why Vercel?
✅ Zero configuration for Vite apps  
✅ Automatic HTTPS  
✅ Global CDN  
✅ Free tier (hobby projects)  
✅ Perfect for React/PWA  

### Method 1: Vercel CLI (Fastest)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
npm run build
vercel --prod

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? karteji
# - Directory? ./
# - Override settings? No
```

### Method 2: GitHub Integration

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-org/karteji.git
git push -u origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Configure:
  - Framework Preset: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`

3. **Deploy**
- Click "Deploy"
- Wait for build to complete
- Get your URL: `https://karteji.vercel.app`

### Vercel Configuration

Create `vercel.json` (optional):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 3. Deployment to Netlify

### Method 1: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build and deploy
npm run build
netlify deploy --prod --dir=dist

# Follow prompts
```

### Method 2: Netlify Drop

1. Build the project:
```bash
npm run build
```

2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag and drop the `dist` folder
4. Get your URL

### Method 3: GitHub Integration

1. Push to GitHub (same as Vercel)
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import existing project"
4. Connect to GitHub
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Deploy

### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

---

## 4. Self-Hosted Deployment

### Requirements
- Ubuntu 22.04+ (or similar Linux)
- Nginx or Apache
- Node.js 18+ (for building)
- Domain name
- SSL certificate (Let's Encrypt)

### Step 1: Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### Step 2: Build Project

```bash
# On your local machine
npm run build

# This creates a 'dist' folder
```

### Step 3: Upload to Server

```bash
# Create directory on server
ssh user@your-server.com
sudo mkdir -p /var/www/karteji
sudo chown -R $USER:$USER /var/www/karteji

# Upload from local machine
scp -r dist/* user@your-server.com:/var/www/karteji/
```

### Step 4: Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/karteji
```

Add this configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    root /var/www/karteji;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Service Worker cache
    location /sw.js {
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }
    
    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/karteji /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 5: Setup SSL (HTTPS)

```bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts
# Certbot will automatically configure HTTPS

# Verify auto-renewal
sudo certbot renew --dry-run
```

### Step 6: Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## 5. Custom Domain Setup

### For Vercel

1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records at your domain registrar:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

5. Wait for DNS propagation (up to 48 hours)

### For Netlify

1. Go to "Domain settings"
2. Add custom domain
3. Update DNS records:

```
Type: A
Name: @
Value: (Netlify IP from dashboard)

Type: CNAME
Name: www
Value: (your-site).netlify.app
```

### For Self-Hosted

DNS records point to your server IP:

```
Type: A
Name: @
Value: YOUR_SERVER_IP

Type: A
Name: www
Value: YOUR_SERVER_IP
```

---

## 6. Environment Configuration

### Create `.env.production`

```env
# API Configuration
VITE_API_URL=https://api.yourdomain.com
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Karteji
VITE_APP_VERSION=1.0.0

# Organization Details
VITE_ORG_NAME=Karang Taruna Kelurahan ABC
VITE_ORG_ADDRESS=Jl. Example No. 123

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true

# Optional Services
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GA_ID=your-google-analytics-id
```

### Using Environment Variables

```javascript
// In your code
const apiUrl = import.meta.env.VITE_API_URL
const orgName = import.meta.env.VITE_ORG_NAME
```

---

## 7. Post-Deployment Verification

### Automated Testing

Run this checklist after deployment:

```bash
# Test PWA functionality
npm run test:pwa

# Lighthouse audit
npx lighthouse https://yourdomain.com --view
```

### Manual Verification Checklist

**PWA Functionality:**
- [ ] App is installable (A2HS prompt appears)
- [ ] App icon displays correctly
- [ ] Splash screen shows on launch
- [ ] App works offline
- [ ] Service Worker registered
- [ ] IndexedDB working

**Core Features:**
- [ ] Login/Register works
- [ ] Dashboard loads
- [ ] Member card displays with QR
- [ ] Can view members list
- [ ] Can create activities
- [ ] Attendance system functional
- [ ] Theme switching works

**Performance:**
- [ ] Lighthouse score > 90
- [ ] Page loads in < 3 seconds
- [ ] Images load properly
- [ ] No console errors

**Mobile Testing:**
- [ ] Responsive on all screen sizes
- [ ] Touch interactions work
- [ ] Bottom navigation accessible
- [ ] Can install on Android
- [ ] Can install on iOS

**Security:**
- [ ] HTTPS enabled
- [ ] No mixed content warnings
- [ ] Security headers present
- [ ] CSP configured (if applicable)

### Debugging Tools

```bash
# Check Service Worker
chrome://serviceworker-internals

# Check PWA Install
chrome://flags/#bypass-app-banner-engagement-checks

# View Application Storage
Chrome DevTools > Application > Storage
```

---

## 8. Monitoring & Maintenance

### Performance Monitoring

**Google Analytics** (Optional):

```javascript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_GA_ID');
</script>
```

**Sentry** (Error Tracking):

```bash
npm install @sentry/react
```

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: "production",
  tracesSampleRate: 1.0,
});
```

### Regular Maintenance

**Weekly:**
- [ ] Check error logs
- [ ] Monitor performance metrics
- [ ] Review user feedback

**Monthly:**
- [ ] Update dependencies
- [ ] Check for security patches
- [ ] Review analytics

**Quarterly:**
- [ ] Full security audit
- [ ] Performance optimization review
- [ ] Feature usage analysis

### Updating the App

```bash
# Make changes locally
git add .
git commit -m "Update: feature description"
git push origin main

# Vercel/Netlify auto-deploys
# For self-hosted:
npm run build
scp -r dist/* user@server:/var/www/karteji/
```

### Backup Strategy

**Database Backup** (When backend implemented):
```bash
# Daily automated backups
0 2 * * * pg_dump karteji_db > /backups/karteji_$(date +\%Y\%m\%d).sql
```

**User Data:**
- IndexedDB data stays on user devices
- Backend data backed up regularly
- Implement export functionality for users

---

## Troubleshooting Common Issues

### Issue: Service Worker not updating

**Solution:**
```javascript
// Force update
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.update())
})
```

### Issue: CORS errors

**Solution:** Configure backend headers:
```javascript
res.header("Access-Control-Allow-Origin", "https://yourdomain.com");
res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
```

### Issue: Build fails on deployment

**Solution:** Check:
- Node version compatibility
- Missing environment variables
- Dependency conflicts

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Images not loading

**Solution:** Check paths:
```javascript
// Use absolute paths
<img src="/images/logo.png" />

// Or relative to public folder
<img src={new URL('./assets/logo.png', import.meta.url).href} />
```

---

## Production Best Practices

1. **Always use HTTPS** - Required for PWA features
2. **Enable compression** - Gzip/Brotli on server
3. **Set proper cache headers** - Balance freshness vs performance
4. **Monitor errors** - Use Sentry or similar
5. **Track metrics** - Lighthouse CI, Analytics
6. **Regular updates** - Keep dependencies current
7. **Test on real devices** - Especially low-end Android
8. **Have rollback plan** - Keep previous build available

---

## Support

If you encounter issues:

1. Check logs (browser console, server logs)
2. Review this documentation
3. Search GitHub issues
4. Create new issue with details

---

**Deployment Complete! 🎉**

Your Karteji PWA is now live and ready to serve your community!
