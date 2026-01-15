# 🚀 Quick Start Guide - Setup Firebase & Data

Panduan cepat untuk setup Firebase Firestore dan populate data awal.

---

## ⚠️ PENTING: Langkah-Langkah Setup

### Step 1: Deploy Firestore Rules (WAJIB!)

**Firestore masih menggunakan rules default yang restrictive.** Ubah rules dulu agar data bisa masuk.

#### Option A: Via Firebase Console (Termudah)

1. **Buka Firebase Console:** https://console.firebase.google.com
2. **Pilih Project:** `katar-9cac3`
3. **Sidebar:** Klik **Firestore Database**
4. **Tab:** Klik **Rules**
5. **Copy rules** dari file `firestore.rules` di repo ini
6. **Paste** ke editor di Console
7. **Klik tombol "Publish"**
8. **Tunggu** 1-2 menit hingga rules aktif

#### Option B: Via Firebase CLI

```bash
# Install Firebase CLI (jika belum)
npm install -g firebase-tools

# Login
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

---

### Step 2: Populate Data ke Firestore

Setelah rules ter-deploy, jalankan seed script:

```bash
npm run seed
```

**Atau:**

```bash
node scripts/seedFirebase.js
```

**Output yang diharapkan:**

```
🌱 Starting Firebase seed...

👥 Seeding Users...
  ✅ Created user: Ahmad Fauzi (super_admin)
  ✅ Created user: Siti Nurhaliza (bendahara)
  ✅ Created user: Budi Santoso (sekretaris)
  ✅ Created user: Dewi Lestari (koordinator)
  ✅ Created user: Eko Prasetyo (anggota)

📅 Seeding Events...
  ✅ Created event: Bakti Sosial Bersih Lingkungan
  ✅ Created event: Senam Pagi Rutin
  ✅ Created event: Rapat Koordinasi Bulanan
  ✅ Created event: Pelatihan Digital Marketing
  ✅ Created event: Turnamen Futsal RT 01

🗳️  Seeding Votings...
  ✅ Created voting: Pemilihan Ketua Karang Taruna 2026
  ✅ Created voting: Pilih Program Prioritas Februari

💰 Seeding Finances...
  ✅ Created finance record

📢 Seeding Announcements...
  ✅ Created announcement: Iuran Bulanan Februari Dibuka
  ✅ Created announcement: Jadwal Kerja Bakti Minggu Ini
  ✅ Created announcement: Selamat kepada Pemenang Arisan

✅ Firebase seed completed successfully!

📊 Summary:
  - Users: 5
  - Events: 5
  - Votings: 2
  - Finances: 1
  - Announcements: 3
```

---

### Step 3: Test Login

Buka aplikasi di browser: **http://localhost:3000**

**Test Accounts:**

| Email | Role | Password |
|-------|------|----------|
| `ahmad@karteji.id` | Super Admin | *(no password - email only)* |
| `siti@karteji.id` | Bendahara | *(no password - email only)* |
| `budi@karteji.id` | Sekretaris | *(no password - email only)* |
| `dewi@karteji.id` | Koordinator | *(no password - email only)* |
| `eko@karteji.id` | Anggota | *(no password - email only)* |

**Cara Login:**
1. Masukkan salah satu email di atas
2. Klik "Masuk"
3. Langsung masuk ke Dashboard

---

### Step 4: Verifikasi Data

Setelah login, cek:

- ✅ **Dashboard:** Muncul greeting, stats kehadiran, upcoming events, announcements
- ✅ **Events/Kegiatan:** Muncul 5 kegiatan (Bakti Sosial, Senam, Rapat, Pelatihan, Futsal)
- ✅ **Voting:** Muncul 2 voting (Pemilihan Ketua, Program Prioritas)
- ✅ **Finance:** Muncul saldo Rp 5.430.000, transaksi 6 item
- ✅ **Profile:** Muncul nama, role, poin aktivitas

---

## 📊 Data Structure

### 1. Users Collection (`users/`)

```javascript
{
  id: 'user-{timestamp}',
  name: 'Ahmad Fauzi',
  email: 'ahmad@karteji.id',
  phone: '08123456789',
  address: 'Jl. Mawar No. 12 RT 01',
  role: 'super_admin', // or: ketua, wakil_ketua, sekretaris, bendahara, koordinator, anggota
  activityPoints: 150,
  joinDate: '2023-06-15',
  createdAt: Timestamp,
  isActive: true,
  photoUrl: 'https://res.cloudinary.com/...'
}
```

**5 sample users** dengan berbagai role untuk testing.

---

### 2. Events Collection (`events/`)

```javascript
{
  id: 'event-{number}',
  title: 'Bakti Sosial Bersih Lingkungan',
  description: 'Kegiatan bersih-bersih lingkungan RT 01...',
  date: '2026-01-25',
  time: '08:00 - 11:00',
  location: 'Jalan Utama RT 01',
  category: 'Bakti Sosial', // or: Olahraga, Rapat, Pelatihan
  status: 'approved', // or: pending, cancelled
  participants: 24,
  maxParticipants: 50,
  attendees: ['user-id1', 'user-id2'],
  createdBy: 'user-id',
  approvedBy: 'user-id',
  createdAt: Timestamp
}
```

**5 upcoming events:**
- Bakti Sosial Bersih Lingkungan (25 Jan)
- Senam Pagi Rutin (20 Jan)
- Rapat Koordinasi Bulanan (28 Jan)
- Pelatihan Digital Marketing (5 Feb)
- Turnamen Futsal RT 01 (10 Feb)

---

### 3. Votings Collection (`votings/`)

```javascript
{
  id: 'vote-{number}',
  title: 'Pemilihan Ketua Karang Taruna 2026',
  description: 'Silakan pilih kandidat...',
  deadline: Timestamp,
  status: 'active', // or: closed
  candidates: [
    {
      id: 'cand-001',
      name: 'Ahmad Fauzi',
      image: 'https://...',
      slogan: 'Pemuda Aktif, RT Produktif!',
      votes: 12
    }
  ],
  totalVoters: 20,
  voters: ['user-id1', 'user-id2'],
  createdBy: 'user-id',
  createdAt: Timestamp
}
```

**2 active votings:**
- Pemilihan Ketua Karang Taruna 2026 (2 kandidat)
- Pilih Program Prioritas Februari (3 pilihan)

---

### 4. Finances Collection (`finances/`)

```javascript
{
  id: 'finance-{number}',
  balance: 5430000,
  thisMonthIncome: 850000,
  thisMonthExpenses: 420000,
  transactions: [
    {
      id: 'tx-001',
      date: '2026-01-15',
      description: 'Iuran Bulanan Januari',
      type: 'IN', // or: OUT
      amount: 500000,
      category: 'Iuran',
      status: 'approved',
      createdBy: 'user-id',
      approvedBy: 'user-id'
    }
  ],
  updatedAt: Timestamp
}
```

**1 finance record** dengan 6 transaksi (3 IN, 3 OUT).

---

### 5. Announcements Collection (`announcements/`)

```javascript
{
  id: 'announce-{number}',
  title: 'Iuran Bulanan Februari Dibuka',
  message: 'Iuran RT 01 bulan Februari sudah bisa dibayarkan...',
  type: 'info', // or: warning, success, urgent
  priority: 'high', // or: medium, low
  createdBy: 'user-id',
  createdAt: Timestamp,
  expiresAt: Timestamp
}
```

**3 announcements:**
- Iuran Bulanan Februari Dibuka
- Jadwal Kerja Bakti Minggu Ini
- Selamat kepada Pemenang Arisan

---

## 🖼️ Cloudinary Images

Sample data menggunakan Cloudinary URLs dengan format:

```
https://res.cloudinary.com/dbxktcwug/image/upload/v1/karteji/{filename}.jpg
```

**Images yang digunakan:**
- `ahmad.jpg` - Foto Ahmad Fauzi
- `siti.jpg` - Foto Siti Nurhaliza
- `budi.jpg` - Foto Budi Santoso
- `dewi.jpg` - Foto Dewi Lestari
- `eko.jpg` - Foto Eko Prasetyo
- `balai.jpg` - Foto Balai RT
- `tenda.jpg` - Foto Kursi Tenda
- `lampu.jpg` - Foto Lampu Jalan

**Upload ke Cloudinary:**

1. Buka: https://cloudinary.com
2. Login dengan akun `dbxktcwug`
3. Media Library → Upload
4. Create folder: `karteji/`
5. Upload semua gambar di atas
6. URL otomatis tersedia

**Atau gunakan placeholder:**

Jika gambar belum ada, aplikasi akan menampilkan emoji/placeholder:
- 👨 untuk user tanpa foto
- 📸 untuk event tanpa foto

---

## 🔧 Troubleshooting

### Error: "Permission Denied"

**Penyebab:** Firestore rules belum di-deploy.

**Solusi:**
1. Deploy rules via Firebase Console (Step 1)
2. Tunggu 1-2 menit
3. Coba run seed lagi

---

### Error: "Cannot find module 'firebase'"

**Penyebab:** Dependencies belum terinstall.

**Solusi:**
```bash
npm install
```

---

### Data tidak muncul di aplikasi

**Penyebab:** 
- Seed gagal atau
- Firestore collection name salah

**Solusi:**
1. Cek Firebase Console → Firestore Database
2. Pastikan ada collections: `users`, `events`, `votings`, `finances`, `announcements`
3. Run seed lagi: `npm run seed`

---

### Gambar tidak muncul (broken image)

**Penyebab:** Gambar belum di-upload ke Cloudinary.

**Solusi:**
1. Upload gambar ke Cloudinary folder `karteji/`
2. Atau aplikasi akan menampilkan emoji placeholder

---

## 🎯 Next Steps

Setelah setup selesai:

1. ✅ Test semua fitur (Dashboard, Events, Voting, Finance, Profile)
2. ✅ Test login dengan 5 akun berbeda
3. ✅ Test CRUD operations (create event, vote, dll)
4. ✅ Verifikasi role permissions
5. ✅ Upload logo.jpg ke `/public/logo.jpg`
6. ✅ Deploy ke production (Vercel/Netlify)

---

## 📞 Support

Jika ada masalah:

1. Check Firebase Console logs
2. Check browser console (F12)
3. Run `npm run dev` dan lihat terminal output
4. Contact: admin@karteji.id

---

**Last Updated:** January 15, 2026  
**Version:** 1.0  
**Status:** ✅ Ready to Seed
