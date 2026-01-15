# 🚀 KARTEJI - Karang Taruna Digital

Aplikasi manajemen Karang Taruna RT 05 yang modern, transparan, dan produktif. Dibangun dengan React, Firebase, dan Cloudinary untuk pengalaman digital yang sempurna.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![Firebase](https://img.shields.io/badge/Firebase-12.8.0-orange.svg)

---

## ✨ Fitur Lengkap

### 🔐 **Authentication**
- Login dengan User ID
- Session management dengan localStorage
- Protected routes untuk semua halaman
- Logout functionality

### 🏠 **Dashboard**
- Greeting personal dengan nama user
- Statistik kehadiran bulan ini
- Poin aktivitas real-time
- Upcoming events preview
- Announcements terbaru
- Quick actions

### 📅 **Events/Kegiatan**
- Daftar kegiatan aktif dengan filter kategori
- Detail event (tanggal, waktu, lokasi, peserta)
- Registrasi kehadiran sekali klik
- Status kehadiran per event
- Loading states dan empty states

### 🗳️ **Voting/Musyawarah Digital**
- Voting aktif dengan countdown
- Daftar kandidat dengan foto Cloudinary
- Vote submission real-time
- Progress bar hasil voting
- Voting confirmation screen
- Proteksi double voting

### 💰 **Finance/Keuangan**
- Total saldo kas
- Income dan expenses bulan ini
- Daftar transaksi terbaru
- Monthly finance breakdown
- Format IDR currency
- Export data (coming soon)

### 👤 **Profile**
- Info user lengkap (nama, email, phone)
- Foto profil dari Cloudinary
- Activity points dan badges
- Attendance calendar
- Account settings
- Logout button

### 🎨 **UI/UX**
- Mobile-first responsive design
- Modern gradient backgrounds
- Smooth animations (fadeIn, slideUp)
- Bottom navigation bar
- Loading spinners
- Error handling dengan pesan jelas
- Empty states yang informatif

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - Component-based UI
- **Vite 5.0.8** - Lightning fast build tool
- **React Router DOM 7.1.1** - Client-side routing
- **Tailwind CSS 3.3.6** - Utility-first CSS
- **Lucide React** - Beautiful icons
- **PostCSS & Autoprefixer** - CSS processing

### Backend Services
- **Firebase 12.8.0**
  - Firestore Database - NoSQL database
  - Cloud Storage - File storage
  - Analytics - Usage tracking
- **Cloudinary** - Image optimization & delivery
  - Auto-scaling images
  - Face detection crop
  - Quality optimization

### Development
- **ESLint** - Code linting
- **Git** - Version control
- **GitHub** - Repository hosting

---

## 📦 Installation

### Prerequisites
- Node.js 16+ installed
- npm or yarn
- Firebase account dengan project setup
- Cloudinary account dengan upload preset

### Clone Repository
\`\`\`bash
git clone https://github.com/embii706-art/karteji.git
cd karteji
\`\`\`

### Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Environment Setup
Credentials sudah ter-embed di:
- `/src/lib/firebase.js` - Firebase config
- `/src/lib/cloudinary.js` - Cloudinary config

### Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Aplikasi berjalan di: `http://localhost:5173`

### Build for Production
\`\`\`bash
npm run build
\`\`\`

### Preview Production Build
\`\`\`bash
npm run preview
\`\`\`

---

## 🔥 Setup Data Firebase

Aplikasi ini **100% dinamis** tanpa data demo. Ikuti panduan lengkap di **[SETUP_DATA.md](SETUP_DATA.md)** untuk:

1. ✅ Membuat collections di Firestore
2. ✅ Upload foto ke Cloudinary
3. ✅ Set user ID di localStorage
4. ✅ Testing aplikasi

### Quick Start
```javascript
// Set user ID di browser console
localStorage.setItem('karteji_userId', 'user-001')
```

Kemudian buat minimal:
- 1 user di collection `users`
- 1 event di collection `events`  
- 1 finance summary di collection `finance`

---

## 🗂️ Project Structure

\`\`\`
karteji/
├── public/
│   └── logo.jpg                    # Logo RT 05
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx          # Bottom navigation bar
│   │   └── MockupViewer.jsx       # [DEPRECATED] Old mockup viewer
│   ├── contexts/
│   │   └── AuthContext.jsx        # Authentication state management
│   ├── lib/
│   │   ├── firebase.js            # Firebase initialization
│   │   └── cloudinary.js          # Cloudinary config & helpers
│   ├── screens/
│   │   ├── LoginScreen.jsx        # Login page
│   │   ├── DashboardScreen.jsx    # Home dashboard
│   │   ├── EventsScreen.jsx       # Events list & registration
│   │   ├── VotingScreen.jsx       # Voting interface
│   │   ├── FinanceScreen.jsx      # Finance transparency
│   │   ├── ProfileScreen.jsx      # User profile
│   │   └── SplashScreen.jsx       # [DEPRECATED] Old splash
│   ├── services/
│   │   └── firestoreService.js    # 50+ Firestore operations
│   ├── App.jsx                    # Main app with routing
│   ├── main.jsx                   # App entry point
│   └── index.css                  # Global styles & animations
├── SETUP_DATA.md                  # Data setup guide
├── FIREBASE_CLOUDINARY_INTEGRATION.md
├── FIREBASE_SAMPLE_DATA.md
├── package.json
├── vite.config.js
└── tailwind.config.js
\`\`\`

---

## 🎯 Usage

### 1. Login
- Buka aplikasi di browser
- Masukkan User ID (contoh: `user-001`)
- Atau klik "Quick Login" untuk demo
- Akan redirect ke Dashboard jika user ditemukan

### 2. Navigation
- Gunakan bottom navigation bar
- 5 menu utama: Beranda, Kegiatan, Voting, Keuangan, Profil
- Active state ditampilkan dengan warna primary

### 3. Dashboard
- Lihat greeting dengan nama Anda
- Check kehadiran bulan ini
- Lihat poin aktivitas
- Akses upcoming events
- Baca announcements terbaru

### 4. Events
- Browse daftar kegiatan
- Lihat kategori dengan emoji
- Klik "Daftar" untuk register kehadiran
- Otomatis update jumlah peserta

### 5. Voting
- Pilih kandidat yang Anda dukung
- Lihat progress bar real-time
- Submit vote
- Hasil voting tidak bisa diubah

### 6. Finance
- Cek total saldo kas
- Review income/expense bulan ini
- Lihat transaksi terbaru
- Transparansi keuangan penuh

### 7. Profile
- Update info pribadi (coming soon)
- Lihat poin dan badges
- Check attendance calendar
- Logout dari aplikasi

---

## 🔒 Security & Best Practices

### Authentication
- User ID based authentication
- Session persistence dengan localStorage
- Protected routes dengan React Router
- Auto redirect ke login jika belum auth

### Firebase
- Read/write operations dengan error handling
- Timestamp dengan Firestore Timestamp objects
- Query optimization dengan limit
- Real-time data sync

### Cloudinary
- Auto-scaling images untuk mobile/desktop
- Face detection untuk profile photos
- Quality optimization (auto)
- Format optimization (auto)
- DPR optimization untuk retina displays

### Performance
- Code splitting dengan dynamic imports
- Lazy loading images
- Optimized bundle size dengan Vite
- CSS purging dengan Tailwind

---

## 🎨 Design System

### Colors
- **Primary**: `#003D7A` (Deep Blue)
- **Accent**: `#FFD700` (Gold Yellow)
- **Success**: `#10B981` (Green)
- **Danger**: `#EF4444` (Red)
- **Warning**: `#F59E0B` (Orange)

### Typography
- Font: Inter (Google Fonts)
- Weights: 400, 500, 600, 700

### Spacing
- Base unit: 4px (Tailwind default)
- Container max-width: 448px (mobile-first)

### Animations
- fadeIn: 0.5s ease-out
- slideUp: 0.6s ease-out  
- gradient: 8s infinite

---

## 🐛 Troubleshooting

### Login gagal
**Error**: "User ID tidak ditemukan"
- Pastikan document `users/{userId}` ada di Firestore
- Cek userId yang diinput sudah benar
- Lihat Console browser untuk error detail

### Data tidak muncul
**Error**: "Profile not found" / "Finance data not found"
- Pastikan semua required collections sudah dibuat
- Check struktur data sesuai dengan [SETUP_DATA.md](SETUP_DATA.md)
- Lihat Network tab untuk Firebase requests

### Foto tidak muncul
**Error**: Image broken icon
- Cek public ID di Cloudinary sesuai dengan `photoUrl` di Firestore
- Pastikan upload preset `Karteji` sudah disetup
- Verify Cloud name: `dbxktcwug`

### Build error
**Error**: Module not found
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
npm run dev
\`\`\`

---

## 🚀 Deployment

### Vercel (Recommended)
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Netlify
\`\`\`bash
npm run build
# Upload dist/ folder ke Netlify
\`\`\`

### Firebase Hosting
\`\`\`bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
\`\`\`

---

## 📈 Roadmap

### Version 1.1 (Next Release)
- [ ] Real Firebase Authentication (Email/Password)
- [ ] Push notifications untuk events
- [ ] Discussion forum feature
- [ ] Export finance reports (PDF/Excel)
- [ ] Dark mode toggle

### Version 1.2
- [ ] PWA support (offline mode)
- [ ] Multi-RT support
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] Chat feature

### Version 2.0
- [ ] Mobile apps (React Native)
- [ ] AI-powered insights
- [ ] Integration dengan payment gateway
- [ ] Advanced voting mechanisms

---

## 👥 Contributors

- **Developer**: embii706-art
- **Project**: KARTEJI - Karang Taruna Digital
- **Organization**: Karang Taruna RT 05

---

## 📄 License

This project is private and proprietary. Not for public distribution.

---

## 🙏 Acknowledgments

- React Team untuk amazing framework
- Firebase untuk backend infrastructure
- Cloudinary untuk image management
- Tailwind CSS untuk styling system
- Lucide untuk beautiful icons
- Vite untuk blazing fast development

---

## 📞 Support

Butuh bantuan? Kontak:
- **GitHub Issues**: [Create Issue](https://github.com/embii706-art/karteji/issues)
- **Email**: admin@karteji.id (contoh)
- **WhatsApp**: 0812-3456-7890 (contoh)

---

**Made with ❤️ for Karang Taruna RT 05**

*Pemuda Aktif, RT Produktif* ✨


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
