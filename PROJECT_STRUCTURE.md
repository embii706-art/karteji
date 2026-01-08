# 📁 Karteji Project Structure

```
karteji/
│
├── 📄 README.md                      # Main documentation
├── 📄 QUICKSTART.md                  # Quick setup guide
├── 📄 IMPLEMENTATION.md              # What's been built
│
├── 📁 docs/                          # Detailed documentation
│   ├── ARCHITECTURE.md               # System design & flows
│   └── DEPLOYMENT.md                 # Production deployment
│
├── 📁 public/                        # Static assets
│   ├── pwa-64x64.png                # (To be added - app icon)
│   ├── pwa-192x192.png              # (To be added)
│   ├── pwa-512x512.png              # (To be added)
│   └── maskable-icon-512x512.png    # (To be added)
│
├── 📁 src/                          # Source code
│   │
│   ├── 📁 components/               # Reusable components
│   │   ├── Auth/
│   │   │   └── ProtectedRoute.jsx   # Auth guard
│   │   └── Layout/
│   │       └── Layout.jsx           # Main layout
│   │
│   ├── 📁 config/                   # Configuration
│   │   ├── app.js                   # App settings
│   │   ├── roles.js                 # User roles & permissions
│   │   └── themes.js                # Theme configurations
│   │
│   ├── 📁 contexts/                 # State management
│   │   ├── AppContext.jsx           # App-wide state
│   │   ├── AuthContext.jsx          # Authentication
│   │   ├── OfflineContext.jsx       # Network & sync
│   │   └── ThemeContext.jsx         # Theme system
│   │
│   ├── 📁 pages/                    # Page components
│   │   ├── Activities/
│   │   │   ├── Activities.jsx       # Activities list
│   │   │   └── ActivityDetail.jsx   # Activity details
│   │   ├── Announcements/
│   │   │   └── Announcements.jsx    # Announcements page
│   │   ├── Aspirations/
│   │   │   └── Aspirations.jsx      # Ideas & voting
│   │   ├── Attendance/
│   │   │   ├── Attendance.jsx       # Attendance management
│   │   │   └── AttendanceScan.jsx   # QR scanner
│   │   ├── Auth/
│   │   │   ├── Login.jsx            # Login page
│   │   │   └── Register.jsx         # Registration
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx        # Main dashboard
│   │   ├── Finance/
│   │   │   └── Finance.jsx          # Financial transparency
│   │   ├── MemberCard/
│   │   │   └── MemberCard.jsx       # Digital member card
│   │   ├── Members/
│   │   │   ├── Members.jsx          # Members list
│   │   │   └── MemberDetail.jsx     # Member profile
│   │   ├── Profile/
│   │   │   └── Profile.jsx          # User profile
│   │   ├── Settings/
│   │   │   └── Settings.jsx         # App settings
│   │   ├── NotFound.jsx             # 404 page
│   │   └── PlaceholderPages.jsx     # Page templates
│   │
│   ├── 📁 utils/                    # Utility functions
│   │   ├── attendance.js            # Attendance logic
│   │   ├── db.js                    # IndexedDB operations
│   │   ├── image.js                 # Image handling
│   │   └── registerSW.js            # Service Worker
│   │
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # App entry point
│   └── index.css                    # Global styles
│
├── 📄 index.html                     # HTML template
├── 📄 package.json                   # Dependencies
├── 📄 vite.config.js                # Vite configuration
├── 📄 tailwind.config.js            # Tailwind CSS config
├── 📄 postcss.config.js             # PostCSS config
└── 📄 .gitignore                    # Git ignore rules
```

## 📂 Directory Purpose

### `/docs` - Documentation
Complete technical documentation for developers and deployers.

### `/public` - Static Assets
Files served as-is without processing. Icons, manifest, etc.

### `/src/components` - Reusable Components
UI components used across multiple pages.

### `/src/config` - Configuration
App settings, roles, permissions, themes.

### `/src/contexts` - State Management
React Context providers for global state.

### `/src/pages` - Page Components
One folder per feature/page of the app.

### `/src/utils` - Utilities
Helper functions, database operations, image handling.

## 🔑 Key Files

### Configuration
- `vite.config.js` - Build system & PWA config
- `tailwind.config.js` - Design system
- `src/config/app.js` - App settings
- `src/config/roles.js` - Permission system

### State Management
- `src/contexts/AuthContext.jsx` - User & authentication
- `src/contexts/AppContext.jsx` - App data
- `src/contexts/ThemeContext.jsx` - Light/dark mode
- `src/contexts/OfflineContext.jsx` - Offline sync

### Core Logic
- `src/utils/db.js` - Database operations
- `src/utils/attendance.js` - Attendance system
- `src/utils/registerSW.js` - PWA functionality

### Entry Points
- `index.html` - HTML shell
- `src/main.jsx` - JavaScript entry
- `src/App.jsx` - React app root

## 📊 File Count Summary

- **Configuration**: 6 files
- **Documentation**: 5 files  
- **Components**: 2 folders
- **Contexts**: 4 files
- **Pages**: 20+ files (13 features)
- **Utils**: 4 files
- **Total**: ~45 source files

## 🎯 What to Edit

### For Branding
- `public/*.png` - Replace with your logos
- `tailwind.config.js` - Change colors
- `src/config/app.js` - Update org info

### For Features
- `src/pages/*` - Add page content
- `src/components/*` - Build reusable UI
- `src/App.jsx` - Add routes

### For Logic
- `src/contexts/*` - Extend state
- `src/utils/*` - Add utilities
- `src/config/roles.js` - Modify permissions

## 📦 Dependencies Overview

### Core
- **React 18.2** - UI framework
- **React Router 6** - Navigation
- **Vite 5** - Build tool

### PWA
- **vite-plugin-pwa** - PWA generation
- **workbox** - Service Worker

### Styling
- **Tailwind CSS** - Utility-first CSS
- **PostCSS** - CSS processing

### Utilities
- **idb** - IndexedDB wrapper
- **qrcode** - QR generation
- **qr-scanner** - QR scanning
- **nanoid** - Unique IDs
- **date-fns** - Date utilities
- **browser-image-compression** - Image optimization

## 🔄 Data Flow

```
User Interaction
    ↓
Page Component (src/pages/*)
    ↓
Context Provider (src/contexts/*)
    ↓
Utility Function (src/utils/*)
    ↓
IndexedDB Storage
    ↓
[If Online] API Call (future)
```

## 🚀 Build Output

```
dist/
├── index.html
├── assets/
│   ├── main-[hash].js
│   ├── main-[hash].css
│   └── [chunked files]
├── pwa-*.png
├── sw.js (Service Worker)
└── manifest.webmanifest
```

## 📝 Notes

- All source files use `.jsx` extension
- Context files use React Context API
- Utilities are pure functions
- Pages are functional components
- Styling uses Tailwind utilities
- IndexedDB for offline storage
- Service Worker for PWA features

---

**Quick Navigation:**
- [README](README.md) - Overview & setup
- [QUICKSTART](QUICKSTART.md) - Fast start guide
- [ARCHITECTURE](docs/ARCHITECTURE.md) - System design
- [DEPLOYMENT](docs/DEPLOYMENT.md) - Go to production
- [IMPLEMENTATION](IMPLEMENTATION.md) - What's done
