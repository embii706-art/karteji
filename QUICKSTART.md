# 🚀 Quick Start Guide - Karteji PWA

## 30-Second Setup

```bash
cd karteji
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## First Time Use

### 1. Register First User
- Go to `/register`
- Fill in the form
- First user = **Super Admin** automatically
- You'll be logged in immediately

### 2. Explore Features
- **Dashboard** - Overview and quick actions
- **Member Card** - Your digital card with QR code
- **Members** - View all members (add functionality coming)
- **Activities** - Create and manage events
- **Attendance** - QR-based check-in system

---

## Project Commands

```bash
# Development
npm run dev          # Start dev server (localhost:3000)

# Production
npm run build        # Build for production (creates dist/)
npm run preview      # Preview production build

# Code Quality
npm run lint         # Check code quality
```

---

## Key Files to Know

### Configuration
- `src/config/app.js` - App settings & feature flags
- `src/config/roles.js` - User roles & permissions
- `tailwind.config.js` - Design system & colors

### State Management
- `src/contexts/AuthContext.jsx` - User authentication
- `src/contexts/AppContext.jsx` - App data (members, activities, etc.)
- `src/contexts/ThemeContext.jsx` - Light/dark mode
- `src/contexts/OfflineContext.jsx` - Network status

### Core Logic
- `src/utils/db.js` - IndexedDB database operations
- `src/utils/attendance.js` - Attendance system
- `src/utils/image.js` - Photo upload & compression

---

## Common Tasks

### Add a New Page

1. Create page component:
```javascript
// src/pages/MyFeature/MyFeature.jsx
const MyFeature = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">My Feature</h1>
      {/* Your content */}
    </div>
  )
}

export default MyFeature
```

2. Add route in `src/App.jsx`:
```javascript
import MyFeature from './pages/MyFeature/MyFeature'

// In the Routes:
<Route path="/my-feature" element={<MyFeature />} />
```

3. Add to navigation in `src/components/Layout/Layout.jsx`

### Customize Branding

1. **Colors** - Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#YOUR_COLOR',
    // ...
  }
}
```

2. **Organization Info** - Edit `src/config/app.js`:
```javascript
organization: {
  name: 'Your Organization Name',
  address: 'Your Address',
  // ...
}
```

3. **Icons** - Replace files in `public/`:
- `pwa-64x64.png`
- `pwa-192x192.png`
- `pwa-512x512.png`

### Add Permission Check

```javascript
import { hasPermission } from '../config/roles'
import { useAuth } from '../contexts/AuthContext'

const MyComponent = () => {
  const { user } = useAuth()
  
  if (!hasPermission(user.role, 'CREATE_ACTIVITY')) {
    return <div>No permission</div>
  }
  
  return <div>Protected content</div>
}
```

### Save Data (Works Offline)

```javascript
import { useApp } from '../contexts/AppContext'

const MyComponent = () => {
  const { addActivity } = useApp()
  
  const handleSave = async () => {
    await addActivity({
      id: Date.now().toString(),
      name: 'New Activity',
      date: new Date(),
      // ...
    })
    // Automatically saved to IndexedDB
    // Synced to server when online
  }
  
  return <button onClick={handleSave}>Save</button>
}
```

---

## Debugging

### Check Service Worker
1. Open Chrome DevTools
2. Go to Application tab
3. Click "Service Workers"
4. See registration status

### Check IndexedDB
1. Open Chrome DevTools
2. Go to Application tab
3. Expand "IndexedDB"
4. See stored data

### Check Network Status
```javascript
import { useOffline } from '../contexts/OfflineContext'

const { online, queuedActions } = useOffline()
console.log('Online:', online)
console.log('Queued:', queuedActions)
```

---

## Testing Offline

### Method 1: DevTools
1. Open Chrome DevTools
2. Go to Network tab
3. Check "Offline"
4. Reload page - should still work!

### Method 2: Service Worker
1. Open Application tab
2. Click "Service Workers"
3. Check "Offline"

### Method 3: Real Device
1. Install PWA on phone
2. Turn on Airplane mode
3. Open app - works!

---

## Deployment Quick Steps

### Vercel (Easiest)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for details.

---

## Troubleshooting

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Service Worker not updating"
```javascript
// In Chrome: chrome://serviceworker-internals
// Click "Unregister" then reload
```

### "IndexedDB error"
```javascript
// Clear browser data for localhost
// Or use Incognito mode
```

### "Build fails"
```bash
# Check Node version
node -v  # Should be 18+

# Clear cache
npm cache clean --force
npm install
```

---

## Architecture Quick Reference

```
User Action
    ↓
React Component
    ↓
Context (State Management)
    ↓
IndexedDB (Local Storage)
    ↓
[If Online] → Backend API
```

---

## Useful Resources

- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Tailwind**: https://tailwindcss.com
- **PWA Guide**: https://web.dev/progressive-web-apps

---

## Getting Help

1. Check [README.md](README.md) for overview
2. Check [ARCHITECTURE.md](docs/ARCHITECTURE.md) for design
3. Check [DEPLOYMENT.md](docs/DEPLOYMENT.md) for production
4. Check [IMPLEMENTATION.md](IMPLEMENTATION.md) for status

---

## Key Concepts

### 1. Offline-First
- Data saves locally first
- Syncs to server when online
- No data loss if offline

### 2. PWA (Progressive Web App)
- Installable like native app
- Works offline
- Fast loading
- Push notifications (optional)

### 3. Role-Based Access
- Different permissions per role
- Super Admin → Ketua → Wakil Ketua → etc.
- First user = Super Admin

### 4. Context API
- Global state management
- Auth, App, Theme, Offline contexts
- Use hooks: `useAuth()`, `useApp()`, etc.

### 5. IndexedDB
- Browser database
- Stores all app data
- Works offline
- Faster than API calls

---

## Quick Tips

💡 **Always use `className` not `class`** (React)  
💡 **Use absolute imports** for cleaner code  
💡 **Test on real mobile devices** not just desktop  
💡 **Check offline mode** before deploying  
💡 **Use Context hooks** for state access  
💡 **IndexedDB is async** - always await  
💡 **Service Worker updates** may need force refresh  

---

**Happy Coding! 🚀**

For detailed info, see the full documentation in the `docs/` folder.
