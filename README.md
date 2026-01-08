# 🚀 Karteji - Karang Taruna Digital PWA

**Production-Ready Progressive Web App for Indonesian Youth Organizations**

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)](https://web.dev/progressive-web-apps/)

## 📋 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Overview

Karteji is a production-ready Progressive Web App designed for Karang Taruna organizations to digitize operations, improve transparency, and enable modern community management.

### Key Features

✅ **Installable** - Works like native app on Android & iOS  
✅ **Offline-First** - Full functionality without internet  
✅ **Low-End Optimized** - Runs on budget Android phones  
✅ **Role-Based Access** - Strict permission system  
✅ **QR Attendance** - Modern attendance tracking  
✅ **Digital Member Card** - With secure QR code  
✅ **Finance Transparency** - Track income/expenses  
✅ **Aspirations & Voting** - Community engagement  

## 📱 Core Features

### 1. Digital Member Card 🪪
- Unique QR code per member
- Works offline
- Professional design
- Organization branding

### 2. Smart Attendance ✅
- Online & offline support
- QR code scanning
- Duplicate prevention
- Auto-sync when online
- Attendance history

### 3. Member Management 👥
- Complete database
- Online/offline status
- Role management
- Profile photos

### 4. Activities & Events 📅
- Create and manage events
- Registration system
- Photo documentation
- Attendance tracking

### 5. Finance 💰
- Transaction tracking
- Balance monitoring
- Upload proofs
- Transparent reporting

### 6. Announcements 📢
- Official announcements
- Push notifications
- Priority levels

### 7. Aspirations 💡
- Idea submission
- Voting system
- Transparent results

## 🏗️ Architecture

```
Client (PWA)
├── React Components
├── Context API State
├── IndexedDB Storage
└── Service Worker

↕ (When Online)

Backend API (Future)
├── REST API
├── JWT Auth
└── Database
```

## 👥 Role Management

### Role Hierarchy

```
Super Admin + Anggota (1 person)
    ↓
Ketua + Anggota (1 person)
    ↓
Wakil Ketua + Anggota (1 person)
    ↓
Bendahara/Sekretaris + Anggota
    ↓
Sie/Divisi + Anggota
    ↓
Anggota (Members)
    ↓
Tamu (Guests)
```

### Permission Rules

- **Super Admin**: Can manage all roles
- **Ketua**: Cannot edit Super Admin & Ketua
- **Wakil Ketua**: Cannot edit Super Admin, Ketua, Wakil Ketua
- **First User**: Automatically becomes Super Admin

## 📴 Offline Support

### Offline Features
- ✅ View all cached data
- ✅ Digital member card
- ✅ Mark attendance (queued)
- ✅ Create content (queued)
- ⚠️ Photo upload (synced later)
- ❌ Real-time updates

### Sync Strategy
1. Actions queued when offline
2. Auto-sync when connection returns
3. Manual sync available
4. Visual sync indicators

## ✅ Attendance System

### Online Flow
1. Generate QR code (5-min expiry)
2. Scan member card
3. Validate & mark attendance
4. Instant sync to server

### Offline Flow
1. Scan member card (works offline!)
2. Save to IndexedDB
3. Queue for sync
4. Auto-sync when online

### QR Code Format

**Member Card:**
```json
{
  "type": "member_card",
  "memberId": "KT-2026-001",
  "name": "John Doe",
  "timestamp": 1704720000000
}
```

## 🎨 Theme System

### Two-Layer Approach

**Layer 1: User Preference (Manual)**
- Light or Dark mode
- NEVER auto-changed
- Saved permanently

**Layer 2: Special Themes (Auto)**
- Holiday decorations
- Religious periods
- Organization events
- Visual only, respects user preference

## ⚡ Performance

### Optimization
- Image compression (max 500KB)
- Code splitting
- Lazy loading
- Cache strategies
- Low-end device detection

### Targets
- First Paint: < 1.5s
- Interactive: < 3.0s
- Lighthouse: > 90

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Self-Hosted
```bash
npm run build
# Upload dist/ folder to your server
# Configure Nginx/Apache
```

## 🎨 Customization

### Organization Branding
1. Replace logos in `public/`
2. Update `src/config/app.js`
3. Customize colors in `tailwind.config.js`

### Feature Flags
Edit `src/config/app.js`:
```javascript
features: {
  memberCard: true,
  attendance: true,
  finance: true,
  // ...
}
```

## 📁 Project Structure

```
src/
├── components/      # Reusable components
├── config/         # App configuration
├── contexts/       # React Context providers
├── pages/          # Page components
├── utils/          # Utility functions
├── App.jsx         # Main app
└── main.jsx        # Entry point
```

## 🔒 Security

- JWT authentication (when backend implemented)
- Role-based access control
- XSS protection
- HTTPS required in production
- Secure data storage

## 🎯 Roadmap

**Current (Phase 1)** ✅
- Core PWA functionality
- Offline support
- Member cards & attendance

**Next (Phase 2)**
- Backend API integration
- Real-time sync
- Push notifications

**Future (Phase 3)**
- Chat/messaging
- Video meetings
- Mobile app

## 📄 License

MIT License

## 🙏 Contributing

Contributions welcome! Please open an issue or PR.

---

**Built with ❤️ for Indonesian Youth Organizations**