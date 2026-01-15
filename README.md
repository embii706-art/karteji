# 🚀 KARTEJI – Karang Taruna Digital

**Sistem Manajemen Karang Taruna RT 05 Berbasis Web**  
Progressive Web App untuk pengelolaan organisasi pemuda RT yang modern, transparan, dan efisien.

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.8.0-orange)](https://firebase.google.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.3.6-cyan)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📖 Table of Contents

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#️-tech-stack)
- [Quick Start](#-quick-start)
- [Authentication](#-authentication)
- [Fitur Aplikasi](#-fitur-aplikasi)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Firebase Setup](#-firebase-setup)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Contributing](#-contributing)

---

## ✨ Fitur Utama

### 🔐 **Autentikasi Real**
- **Register** - Pendaftaran anggota baru dengan form validasi lengkap
- **Login** - Email-based authentication (bukan userId demo)
- **Logout** - Confirmation dialog untuk keamanan

### 📊 **Dashboard Interaktif**
- Statistik kehadiran real-time
- Total poin aktivitas
- Upcoming events
- Announcements terbaru
- Personal greeting

### 📅 **Manajemen Kegiatan**
- Daftar kegiatan aktif
- Detail kegiatan (tanggal, waktu, lokasi, peserta)
- Pendaftaran kehadiran satu klik
- Kategori: Bakti Sosial, Olahraga, Rapat, Pelatihan

### 🗳️ **Voting Digital**
- Sistem pemilihan demokratis
- Candidate cards dengan foto
- Real-time vote submission
- Transparansi hasil voting

### 💰 **Transparansi Keuangan**
- Total saldo kas
- Income/Expenses bulan ini
- Transaction list (IN/OUT)
- Monthly breakdown

### 👤 **Profil Anggota**
- Foto profil dari Cloudinary
- Info lengkap (nama, role, tanggal gabung)
- Activity points & badges
- Logout dengan konfirmasi

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18.2.0 |
| **Build Tool** | Vite 5.0.8 |
| **Styling** | Tailwind CSS 3.3.6 |
| **Routing** | React Router DOM 7.1.1 |
| **Backend** | Firebase 12.8.0 (Firestore, Storage, Analytics) |
| **Images** | Cloudinary (dbxktcwug, Karteji preset) |
| **Icons** | Lucide React |

---

## 🚀 Quick Start

### Installation

\`\`\`bash
# 1. Clone repository
git clone https://github.com/yourusername/karteji.git
cd karteji

# 2. Install dependencies
npm install

# 3. Setup Firebase
# Edit src/lib/firebase.js dengan Firebase credentials Anda

# 4. Run development server
npm run dev
\`\`\`

Aplikasi akan berjalan di: **http://localhost:5173**

---

## 🔐 Authentication

### Registration Flow (NEW!)

\`\`\`
User → /register → Fill Form → Email Check → Create User → Auto-login → /dashboard
\`\`\`

**Form Fields:**
- Nama Lengkap (required)
- Email (required, unique)
- Nomor HP (required, min 10 digits)
- Alamat (required)

### Login Flow (EMAIL-BASED)

\`\`\`
User → /login → Enter Email → Firestore Query → Login → /dashboard
\`\`\`

**Important:**
- ✅ **NEW:** Login dengan EMAIL (bukan User ID)
- ✅ Production-ready authentication
- ✅ Error handling untuk unregistered email

### Logout Flow

\`\`\`
Profile → Logout Button → Confirmation → Logout → /login
\`\`\`

---

## 📱 Fitur Aplikasi

### 🏠 Dashboard
- Personal greeting
- Attendance stats
- Activity points
- Upcoming events
- Latest announcements

### 📅 Kegiatan (Events)
- Active events list
- Event details & categories
- "Daftar" button untuk kehadiran
- Real-time participant tracking

### 🗳️ Voting
- Active voting sessions
- Candidate cards dengan foto
- Real-time vote submission
- One person, one vote

### 💰 Keuangan
- Total balance
- Monthly income/expenses
- Transaction list (IN/OUT)
- Transparent for all members

### 👤 Profil
- Profile photo
- User info (nama, role, join date, HP, email)
- Activity points & badges
- Logout button

---

## 📂 Project Structure

\`\`\`
karteji/
├── src/
│   ├── components/
│   │   └── BottomNav.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── lib/
│   │   ├── firebase.js
│   │   └── cloudinary.js
│   ├── screens/
│   │   ├── RegisterScreen.jsx     # 🆕 Registration
│   │   ├── LoginScreen.jsx        # 🔄 Email-based
│   │   ├── DashboardScreen.jsx
│   │   ├── EventsScreen.jsx
│   │   ├── VotingScreen.jsx
│   │   ├── FinanceScreen.jsx
│   │   └── ProfileScreen.jsx      # 🔄 With logout
│   ├── services/
│   │   └── firestoreService.js
│   └── App.jsx                    # 🔄 With /register route
├── docs/
│   ├── SETUP_DATA.md
│   └── USER_GUIDE.md             # 🆕 User guide
└── README.md
\`\`\`

---

## 🔧 Development

\`\`\`bash
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

---

## 🔥 Firebase Setup

1. Create Firebase project di [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Firebase Storage
4. Copy config ke \`src/lib/firebase.js\`

**Firestore Collections:**
- \`users\` - User data
- \`events\` - Kegiatan
- \`votings\` - Voting sessions
- \`finances\` - Keuangan

Lihat: [docs/SETUP_DATA.md](docs/SETUP_DATA.md)

---

## 🚀 Deployment

### Vercel
\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

### Netlify
\`\`\`bash
npm run build
netlify deploy --prod --dir=dist
\`\`\`

### Firebase Hosting
\`\`\`bash
npm run build
firebase deploy --only hosting
\`\`\`

---

## 📖 Documentation

- [docs/SETUP_DATA.md](docs/SETUP_DATA.md) - Firebase data setup
- [docs/USER_GUIDE.md](docs/USER_GUIDE.md) - User guide lengkap

---

## 🤝 Contributing

1. Fork project
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 📄 License

MIT License

---

## 🌟 Roadmap

### ✅ Phase 1 - MVP (COMPLETED)
- [x] Dashboard dengan statistik real-time
- [x] Manajemen kegiatan dan kehadiran
- [x] Sistem voting digital
- [x] Transparansi keuangan
- [x] Profil anggota dengan badges
- [x] **Email-based authentication**
- [x] **Registration form**
- [x] **Logout dengan konfirmasi**

### 🚧 Phase 2 - Enhancements (PLANNED)
- [ ] Upload foto profil
- [ ] Edit profil anggota
- [ ] Push notifications
- [ ] Dark mode

### 🚀 Phase 3 - Advanced (FUTURE)
- [ ] Offline mode (PWA)
- [ ] Export laporan PDF
- [ ] WhatsApp integration
- [ ] Mobile app

---

**KARTEJI – Pemuda Aktif, RT Produktif!** 🚀

Made with ❤️ by Karang Taruna RT 05
