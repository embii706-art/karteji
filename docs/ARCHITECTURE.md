# 🏗️ Karteji - System Architecture

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Frontend Architecture](#frontend-architecture)
3. [State Management](#state-management)
4. [Offline Strategy](#offline-strategy)
5. [Attendance Flow](#attendance-flow)
6. [Theme System](#theme-system)
7. [Security Architecture](#security-architecture)
8. [Performance Optimizations](#performance-optimizations)
9. [Future Backend Integration](#future-backend-integration)

---

## 1. High-Level Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (PWA)                         │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │          React Application Layer               │    │
│  │  ┌──────────────┐  ┌──────────────┐           │    │
│  │  │   Pages &    │  │  Components  │           │    │
│  │  │    Routes    │  │  (Reusable)  │           │    │
│  │  └──────────────┘  └──────────────┘           │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │        State Management (Context API)          │    │
│  │  ┌───────────┐ ┌──────────┐ ┌──────────────┐  │    │
│  │  │   Auth    │ │   App    │ │Theme/Offline │  │    │
│  │  │  Context  │ │ Context  │ │   Contexts   │  │    │
│  │  └───────────┘ └──────────┘ └──────────────┘  │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │          Data Layer (IndexedDB)                │    │
│  │  - Members    - Activities   - Attendance      │    │
│  │  - Finance    - Aspirations  - Queue          │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │      Service Worker (PWA Core)                 │    │
│  │  - Caching    - Background Sync                │    │
│  │  - Offline    - Push Notifications             │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (Future)                       │
│  ┌────────────────────────────────────────────────┐    │
│  │           REST API Layer                       │    │
│  │  /auth  /members  /activities  /attendance     │    │
│  └────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────┐    │
│  │         Business Logic Layer                   │    │
│  │  Authentication | Authorization | Validation   │    │
│  └────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────┐    │
│  │         Database (PostgreSQL/MySQL)            │    │
│  │  Users | Members | Activities | Transactions   │    │
│  └────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────┐    │
│  │      File Storage (S3/CloudFlare R2)           │    │
│  │  Profile Photos | Activity Images | Proofs     │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture

### Component Hierarchy

```
App.jsx
├── Router
│   ├── Public Routes
│   │   ├── Login
│   │   └── Register
│   └── Protected Routes (Layout)
│       ├── Header
│       ├── Main Content
│       │   ├── Dashboard
│       │   ├── Member Card
│       │   ├── Members
│       │   ├── Activities
│       │   ├── Attendance
│       │   ├── Announcements
│       │   ├── Finance
│       │   ├── Aspirations
│       │   └── Settings
│       └── Bottom Navigation
```

### Folder Structure

```
src/
├── components/
│   ├── Auth/
│   │   └── ProtectedRoute.jsx
│   ├── Layout/
│   │   └── Layout.jsx
│   └── Common/ (future)
│       ├── Button.jsx
│       ├── Card.jsx
│       └── Modal.jsx
├── config/
│   ├── app.js              # App configuration
│   ├── roles.js            # Role definitions
│   └── themes.js           # Theme configurations
├── contexts/
│   ├── AuthContext.jsx     # Authentication state
│   ├── AppContext.jsx      # App-wide state
│   ├── ThemeContext.jsx    # Theme management
│   └── OfflineContext.jsx  # Network & sync
├── pages/
│   ├── Auth/
│   ├── Dashboard/
│   ├── MemberCard/
│   ├── Members/
│   ├── Activities/
│   ├── Attendance/
│   ├── Announcements/
│   ├── Finance/
│   ├── Aspirations/
│   └── Settings/
├── utils/
│   ├── db.js               # IndexedDB operations
│   ├── attendance.js       # Attendance logic
│   ├── image.js            # Image handling
│   └── registerSW.js       # Service Worker
├── App.jsx
├── main.jsx
└── index.css
```

---

## 3. State Management

### Context Architecture

```
┌──────────────────────────────────────────────┐
│           AuthContext                        │
│  - user (current user data)                  │
│  - isAuthenticated (boolean)                 │
│  - login(email, password)                    │
│  - register(userData)                        │
│  - logout()                                  │
│  - updateUser(updates)                       │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│           AppContext                         │
│  - members (array)                           │
│  - activities (array)                        │
│  - announcements (array)                     │
│  - finance (array)                           │
│  - aspirations (array)                       │
│  - addMember(), updateMember()               │
│  - addActivity(), updateActivity()           │
│  - addAnnouncement()                         │
│  - addTransaction()                          │
│  - addAspiration(), updateAspiration()       │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│           ThemeContext                       │
│  - theme ('light' | 'dark' | 'system')       │
│  - dateTheme (special date theme object)     │
│  - isDark (computed)                         │
│  - reduceAnimations (boolean)                │
│  - toggleTheme()                             │
│  - setThemeMode(mode)                        │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│           OfflineContext                     │
│  - online (boolean)                          │
│  - syncInProgress (boolean)                  │
│  - queuedActions (number)                    │
│  - syncData()                                │
│  - queueAction(action)                       │
└──────────────────────────────────────────────┘
```

### Data Flow Pattern

```
User Action
    ↓
Component Event Handler
    ↓
Context Action
    ↓
Update IndexedDB
    ↓
Update Context State (useReducer)
    ↓
Re-render Components
    ↓
[If Online] Sync to Backend
```

---

## 4. Offline Strategy

### IndexedDB Schema

```javascript
Database: KartejiDB (v1)

Stores:
├── members
│   ├── id (primary key)
│   ├── name, email, phone, role
│   ├── photo, memberId
│   ├── status, joinedAt
│   └── Indexes: role, status

├── activities
│   ├── id (primary key)
│   ├── name, description, date
│   ├── location, status
│   ├── createdBy, createdAt
│   └── Indexes: date, status

├── attendance
│   ├── id (primary key)
│   ├── activityId, memberId
│   ├── memberName, timestamp
│   ├── location, method
│   ├── synced (boolean)
│   └── Indexes: activityId, memberId, synced

├── announcements
│   ├── id (primary key)
│   ├── title, content
│   ├── priority, date
│   ├── author
│   └── Indexes: date, priority

├── finance
│   ├── id (primary key)
│   ├── type (income/expense)
│   ├── amount, description
│   ├── date, proof
│   ├── createdBy
│   └── Indexes: date, type

├── aspirations
│   ├── id (primary key)
│   ├── title, description
│   ├── status, votes
│   ├── createdBy, createdAt
│   └── Indexes: status, votes

└── offline_queue
    ├── id (auto-increment)
    ├── type (action type)
    ├── data (action payload)
    ├── timestamp
    └── Indexes: timestamp, type
```

### Caching Strategy

**Static Assets**: Cache-First
```javascript
// Service Worker
workbox.precacheAndRoute([
  { url: '/index.html', revision: '123' },
  { url: '/assets/main.js', revision: 'abc' }
])
```

**API Calls**: Network-First
```javascript
workbox.routing.registerRoute(
  /^https:\/\/api\.karteji\.app\/.*/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 10
  })
)
```

**Images**: Stale-While-Revalidate
```javascript
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'images-cache'
  })
)
```

### Offline Queue Processing

```
┌─────────────────────────────────────────┐
│ User performs action (offline)           │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ Save data to IndexedDB                   │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ Add action to offline_queue              │
│ {                                        │
│   type: 'mark_attendance',              │
│   data: { activityId, memberId },       │
│   timestamp: Date.now()                  │
│ }                                        │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ Update UI immediately                    │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ [When online] Process queue              │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ For each queued item:                    │
│ 1. POST to API                           │
│ 2. If success, delete from queue         │
│ 3. If fail, keep in queue, retry later   │
└─────────────────────────────────────────┘
```

---

## 5. Attendance Flow

### Complete Attendance System Flow

#### Online Attendance Flow

```
Step 1: Organizer Creates Activity
  ├─ Navigate to Activities
  ├─ Click "Create Activity"
  ├─ Fill form (name, date, location)
  ├─ Save to IndexedDB
  └─ Sync to Backend API

Step 2: Generate Attendance Session
  ├─ Open Activity Detail
  ├─ Click "Start Attendance"
  ├─ Generate QR Code with:
  │   ├─ activityId
  │   ├─ sessionId (unique)
  │   ├─ timestamp (current)
  │   └─ expiresAt (timestamp + 5 min)
  └─ Display QR on screen

Step 3: Member Shows Digital Card
  ├─ Member opens app
  ├─ Navigate to "Member Card"
  ├─ Card displays with QR containing:
  │   ├─ memberId
  │   ├─ name
  │   ├─ role
  │   └─ timestamp
  └─ Show card to organizer

Step 4: Scan & Validate
  ├─ Organizer scans member QR
  ├─ Parse QR data
  ├─ Validate:
  │   ├─ QR type is 'member_card'
  │   ├─ Member exists in database
  │   ├─ Activity matches
  │   ├─ Not already attended
  │   └─ QR not expired
  └─ Show validation result

Step 5: Mark Attendance
  ├─ Create attendance record:
  │   {
  │     id: nanoid(),
  │     activityId,
  │     memberId,
  │     memberName,
  │     timestamp: Date.now(),
  │     method: 'qr_scan',
  │     synced: true
  │   }
  ├─ Save to IndexedDB
  ├─ POST to Backend API
  └─ Show success message

Step 6: View Statistics
  ├─ Calculate:
  │   ├─ Total members
  │   ├─ Present count
  │   ├─ Absent count
  │   └─ Percentage
  └─ Display on Activity Detail
```

#### Offline Attendance Flow

```
[Device is Offline]

Step 1-3: Same as Online
  ├─ Digital card still works (cached)
  └─ QR generation works (no API needed)

Step 4: Scan & Validate (Offline)
  ├─ Scan member QR
  ├─ Check local IndexedDB:
  │   ├─ Member exists?
  │   ├─ Already attended? (check local records)
  │   └─ QR valid?
  └─ Validate locally

Step 5: Mark Attendance (Offline)
  ├─ Create attendance record
  ├─ Save to IndexedDB
  ├─ Set synced: false
  ├─ Add to offline_queue:
  │   {
  │     type: 'sync_attendance',
  │     data: attendanceRecord,
  │     timestamp: Date.now()
  │   }
  └─ Show "Saved (will sync later)" message

Step 6: Background Sync
  ├─ App detects online
  ├─ Process offline_queue
  ├─ For each attendance:
  │   ├─ POST to API
  │   ├─ Update synced: true
  │   └─ Remove from queue
  └─ Show sync complete notification
```

### Attendance Data Structure

```javascript
// Attendance Record
{
  id: 'att_abc123',              // Unique ID
  activityId: 'act_xyz789',      // Activity reference
  memberId: 'mem_def456',        // Member reference
  memberName: 'John Doe',        // Member name (denormalized)
  timestamp: 1704720000000,      // When attended
  location: {                     // Optional GPS
    latitude: -6.2088,
    longitude: 106.8456
  },
  method: 'qr_scan',             // 'qr_scan' | 'manual'
  markedBy: 'admin_id',          // Who marked (for manual)
  synced: true,                  // Sync status
  createdAt: 1704720000000,      // Local creation time
  syncedAt: 1704720060000        // When synced to server
}
```

---

## 6. Theme System

### Theme Architecture

```
┌──────────────────────────────────────────┐
│         User Manual Preference           │
│  ┌────────┐  ┌────────┐  ┌────────┐    │
│  │ Light  │  │  Dark  │  │ System │    │
│  └────────┘  └────────┘  └────────┘    │
│         (ALWAYS RESPECTED)               │
└──────────────────────────────────────────┘
                  ↓
┌──────────────────────────────────────────┐
│      Base Theme Applied to DOM           │
│  document.documentElement.classList      │
│  .add('dark') or .remove('dark')         │
└──────────────────────────────────────────┘
                  ↓
┌──────────────────────────────────────────┐
│    Special Date Theme Detection          │
│  - Check current date                    │
│  - Match against holiday calendar        │
│  - Load theme decoration config          │
└──────────────────────────────────────────┘
                  ↓
┌──────────────────────────────────────────┐
│   Apply Visual Decorations ONLY          │
│  - Change accent colors                  │
│  - Add decorative elements               │
│  - Show themed animations                │
│  (Does NOT change light/dark mode)       │
└──────────────────────────────────────────┘
```

### Theme Configuration Example

```javascript
// Independence Day Theme (Aug 17)
{
  name: 'Kemerdekaan RI',
  active: isIndependenceDay(),
  colors: {
    primary: '#DC2626',      // Red
    secondary: '#FFFFFF',    // White
    accent: '#DC2626'
  },
  decorations: {
    header: 'flags',
    confetti: true,
    animations: 'patriotic'
  },
  duration: 7 // Active 7 days before/after
}

// Ramadan Theme (Variable date)
{
  name: 'Ramadan',
  active: isRamadan(),
  colors: {
    primary: '#059669',      // Green
    secondary: '#FCD34D',    // Gold
    accent: '#8B5CF6'        // Purple
  },
  decorations: {
    header: 'crescent_stars',
    animations: 'sparkle'
  },
  features: {
    prayerSchedule: true,
    fastingReminder: true
  }
}
```

---

## 7. Security Architecture

### Authentication Flow (Future)

```
Step 1: User Login
  ├─ Enter email & password
  ├─ POST /api/auth/login
  └─ Receive JWT token

Step 2: Store Token
  ├─ Save to localStorage
  └─ Add to Axios headers

Step 3: Protected API Calls
  ├─ Include token in header
  ├─ Backend validates token
  └─ Return data or 401

Step 4: Token Refresh
  ├─ Token expires after 1h
  ├─ Auto-refresh before expiry
  └─ Or re-login
```

### Role-Based Access Control

```javascript
// Permission Check Flow
hasPermission(userRole, 'CREATE_ACTIVITY')
  ↓
Check PERMISSIONS constant
  ↓
PERMISSIONS['CREATE_ACTIVITY'] = [
  'super_admin',
  'ketua',
  'wakil_ketua',
  'sekretaris'
]
  ↓
Is userRole in allowed array?
  ↓
Return true/false
```

### Data Validation

```
Client-Side (React)
  ├─ Form validation
  ├─ Type checking
  └─ Required fields

Backend (Future)
  ├─ Schema validation
  ├─ Data sanitization
  ├─ Business logic checks
  └─ Database constraints
```

---

## 8. Performance Optimizations

### Code Splitting Strategy

```javascript
// Route-based splitting
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Members = lazy(() => import('./pages/Members'))

// Component-based splitting
const HeavyChart = lazy(() => import('./components/HeavyChart'))
```

### Image Optimization

```
Upload Flow:
  ↓
Original Image
  ↓
Compress (browser-image-compression)
  ├─ maxSizeMB: 0.5
  ├─ maxWidthOrHeight: 1024
  └─ format: JPEG/WebP
  ↓
Convert to Base64
  ↓
Save to IndexedDB
  ↓
[When Online] Upload to CDN
```

### Performance Monitoring

```javascript
// Core Web Vitals
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

// Custom Metrics
- Time to Interactive: < 3s
- Bundle Size: < 500KB (gzipped)
- Cache Hit Rate: > 80%
```

---

## 9. Future Backend Integration

### API Endpoints (Planned)

```
Auth:
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh

Members:
GET    /api/members
GET    /api/members/:id
POST   /api/members
PUT    /api/members/:id
DELETE /api/members/:id
PATCH  /api/members/:id/role

Activities:
GET    /api/activities
GET    /api/activities/:id
POST   /api/activities
PUT    /api/activities/:id
DELETE /api/activities/:id

Attendance:
GET    /api/attendance
GET    /api/attendance/activity/:activityId
GET    /api/attendance/member/:memberId
POST   /api/attendance
GET    /api/attendance/stats/:activityId

Announcements:
GET    /api/announcements
GET    /api/announcements/:id
POST   /api/announcements
PUT    /api/announcements/:id
DELETE /api/announcements/:id

Finance:
GET    /api/finance
GET    /api/finance/:id
POST   /api/finance
PUT    /api/finance/:id
DELETE /api/finance/:id
GET    /api/finance/balance

Aspirations:
GET    /api/aspirations
GET    /api/aspirations/:id
POST   /api/aspirations
PUT    /api/aspirations/:id
POST   /api/aspirations/:id/vote
```

### Database Schema (PostgreSQL)

```sql
-- Users & Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Members
CREATE TABLE members (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  photo_url VARCHAR(255),
  member_id VARCHAR(50) UNIQUE,
  status VARCHAR(20) DEFAULT 'active',
  joined_at TIMESTAMP DEFAULT NOW()
);

-- Activities
CREATE TABLE activities (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  status VARCHAR(20) DEFAULT 'upcoming',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Attendance
CREATE TABLE attendance (
  id UUID PRIMARY KEY,
  activity_id UUID REFERENCES activities(id),
  member_id UUID REFERENCES members(id),
  timestamp TIMESTAMP DEFAULT NOW(),
  method VARCHAR(20),
  marked_by UUID REFERENCES users(id),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  UNIQUE(activity_id, member_id)
);

-- More tables for announcements, finance, aspirations...
```

---

## Summary

This architecture provides:

✅ **Scalable** - Easy to add features  
✅ **Maintainable** - Clear separation of concerns  
✅ **Performant** - Optimized for low-end devices  
✅ **Resilient** - Works offline, syncs when online  
✅ **Secure** - Role-based access, validation  
✅ **Future-Ready** - Easy backend integration  

**Next Steps:**
1. Implement remaining page components
2. Add real QR scanner functionality
3. Build backend API
4. Implement real-time sync
5. Add push notifications
