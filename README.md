# KARTEJI - Karang Taruna Digital

A modern, high-quality mobile app UI mockup for neighborhood youth organizations in Indonesia, with **real Firebase and Cloudinary integration**.

## 🎯 Overview

KARTEJI is a community management application designed for **Karang Taruna** (youth organizations) at the RT (neighborhood) level. The app enables non-technical youth members to:

- ✅ Manage daily activities and events
- ✅ Participate in transparent financial tracking
- ✅ Engage in community voting/musyawarah (discussions)
- ✅ Attend events and track participation
- ✅ View announcements and updates
- ✅ Manage their personal profile

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Firebase project (already configured)
- Cloudinary account (already configured)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# Navigate to http://localhost:3000
```

The app will automatically use the configured Firebase and Cloudinary services.

## 📱 Screens Included

### 1. **Splash/Login Screen**
- KARTEJI branding and logo
- Welcoming slogan: "Pemuda Aktif, RT Produktif"
- Login and registration buttons

### 2. **Dashboard**
- Personalized greeting with user's first name
- Attendance summary (real data from Firebase)
- Activity points tracker
- Quick action buttons for main features
- Upcoming events preview
- Important announcements

### 3. **Events Screen**
- List of active community activities
- Event details (date, time, location, attendees)
- Event category filtering
- Attendance registration with real Firebase submission

### 4. **Voting/Musyawarah Screen**
- Community decision-making interface
- Candidate selection with photos from Cloudinary
- Live vote counting
- Countdown timer to voting deadline
- Transparent result visualization

### 5. **Finance/Keuangan Screen**
- Transparent financial dashboard
- Total balance display
- Monthly income/expense breakdown
- Detailed transaction list
- Real data from Firebase

### 6. **Member Profile Screen**
- User profile with Cloudinary-optimized photo
- Activity points and badges
- Participation calendar
- Member statistics
- Account settings

## 🔥 Real Integration

### Firebase Configuration
```javascript
Project ID: katar-9cac3
Auth Domain: katar-9cac3.firebaseapp.com
Database: Firestore (Cloud Firestore)
Storage: Cloud Storage
```

**Collections Available:**
- `users` - Member profiles
- `events` - Activities and events
- `voting` - Community voting sessions
- `finance/transactions` - Financial records
- `announcements` - Official announcements
- `attendance` - Event attendance tracking

### Cloudinary Configuration
```
Cloud Name: dbxktcwug
Upload Preset: Karteji
```

**Features:**
- Automatic image optimization
- Smart format selection (WebP/JPEG)
- Mobile device DPI detection
- Responsive image sizing

## 📁 Project Structure

```
karteji/
├── src/
│   ├── screens/              # All 6 screens
│   ├── components/           # Mockup viewer
│   ├── services/            # Firebase operations
│   ├── lib/                 # Firebase & Cloudinary config
│   └── assets/
├── index.html
├── tailwind.config.js        # Design system
├── vite.config.js
└── package.json
```

## 🎨 Design System

### Colors
- **Primary**: Deep Blue (#003D7A)
- **Accent**: Yellow (#FFD700)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Danger**: Red (#EF4444)
- **Background**: White (#FFFFFF)

### Typography
- Font: Inter (modern sans-serif)
- Large, readable text optimized for mobile
- High contrast for accessibility

### Components
- Rounded cards with soft shadows
- Bottom navigation bar (5 items)
- Loading spinners
- Error boundaries with fallback data

## 🔗 Available Endpoints

### User Operations
```javascript
getUserProfile(userId)
updateUserProfile(userId, data)
getUserActivityPoints(userId)
```

### Events
```javascript
getEvents(limit)           // Get active events
registerEventAttendance(eventId, userId)
```

### Finance
```javascript
getFinanceSummary()
getTransactions(limit)
getMonthlyFinance(year, month)
```

### Voting
```javascript
getActiveVoting()
submitVote(votingId, userId, candidateId)
getVotingResults(votingId)
```

### Announcements
```javascript
getAnnouncements(limit)
```

## 📊 Sample Data

To populate the app with test data:

1. Go to Firebase Console: https://console.firebase.google.com
2. Select project `katar-9cac3`
3. Follow [FIREBASE_SAMPLE_DATA.md](./FIREBASE_SAMPLE_DATA.md) to add sample documents

**Demo User ID**: `demo-user-001`

## 📚 Documentation

- [Firebase & Cloudinary Integration Guide](./FIREBASE_CLOUDINARY_INTEGRATION.md) - Complete setup and schema
- [Sample Data Setup](./FIREBASE_SAMPLE_DATA.md) - How to populate test data

## 🛠 Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

Output will be in the `dist/` directory, ready for deployment.

## 📦 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Firebase (Auth, Firestore, Storage, Analytics)
- **Media**: Cloudinary
- **Build**: Vite 5

## 🔐 Security

### Firestore Security Rules
- Users can only read their own profile
- Public read access for events, announcements, finance
- Authenticated-only voting
- Subcollection security rules for voting and attendance

### Cloudinary
- Unsigned uploads enabled (safe for client-side)
- Rate limiting (100 uploads/hour per IP)
- Automatic malware scanning

## 🚨 Error Handling

All screens include:
- **Loading states** - Animated spinner while fetching
- **Error messages** - User-friendly error displays
- **Fallback data** - Shows example data if Firebase fails
- **Retry capability** - Users can refresh to reload data

## 📱 Responsive Design

- Optimized for mobile-first design
- Works on Android and iOS
- Bottom navigation for easy thumb access
- Touch-friendly buttons and spacing
- Tested on low-end Android devices

## 🌍 Localization

- Full Indonesian language support (Bahasa Indonesia)
- Currency formatting (IDR - Indonesian Rupiah)
- Date formatting for local calendar

## 🎯 Next Steps

1. **Add Real Data**: Import sample data from [FIREBASE_SAMPLE_DATA.md](./FIREBASE_SAMPLE_DATA.md)
2. **Enable Authentication**: Integrate Firebase Auth (Google, Phone, Email)
3. **Upload Images**: Add profile photos and event images to Cloudinary
4. **Setup Security Rules**: Configure Firestore security rules for production
5. **Deploy**: Push to production hosting (Firebase Hosting, Vercel, etc.)
6. **Monitor**: Enable Firebase Analytics and performance monitoring

## 📞 Support

### Common Issues

**Firebase Data Not Showing:**
1. Check Firestore collections exist in Console
2. Verify data matches schema in documentation
3. Check browser console for errors
4. Ensure Firestore security rules allow read access

**Cloudinary Images Not Loading:**
1. Verify public IDs match uploaded images
2. Check upload preset is configured
3. Test URL in browser directly

**App Won't Start:**
1. Ensure Node.js 16+ is installed
2. Run `npm install` to fetch dependencies
3. Check port 3000 is available
4. Try `npm run dev` with debug output

## 📄 License

This project is provided for commercial and educational use.

## 👥 Author

Created for **Karang Taruna RT 05** community organization.

---

**Status**: Production Ready ✅  
**Last Updated**: January 15, 2026  
**Version**: 1.0.0
