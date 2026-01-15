# 🚀 Setup Data Firebase & Cloudinary untuk KARTEJI

Aplikasi KARTEJI sekarang **100% dinamis** dan tidak ada data demo. Semua data harus ada di Firebase dan Cloudinary.

## ✅ Status Aplikasi

- ❌ **TIDAK ADA** data demo/fallback
- ✅ **100% dinamis** dari Firebase Firestore
- ✅ **Semua foto** dari Cloudinary
- ✅ Loading states untuk semua data
- ✅ Empty states jika data kosong
- ✅ Error handling yang proper

---

## 📋 Langkah Setup Data

### 1️⃣ Setup User ID

Aplikasi menggunakan `localStorage` untuk menyimpan user ID:

```javascript
localStorage.setItem('karteji_userId', 'user-001')
```

Atau buka Console browser dan jalankan command di atas.

---

### 2️⃣ Upload Foto ke Cloudinary

#### Dashboard Cloudinary:
1. Login ke **Cloudinary**: https://cloudinary.com/console
2. Cloud name: `dbxktcwug`
3. Upload Preset: `Karteji`

#### Upload Foto Profil:
- Nama file harus sesuai dengan `photoUrl` di Firestore
- Contoh: upload foto dengan public ID: `user-001-profile`

#### Upload Foto Event:
- Upload dengan public ID: `event-001`, `event-002`, dst

#### Upload Foto Kandidat Voting:
- Upload dengan public ID: `candidate-001`, `candidate-002`, dst

---

### 3️⃣ Struktur Data Firebase Firestore

#### Collection: `users`
Document ID: `user-001` (atau sesuai userId Anda)

```json
{
  "name": "Andi Wijaya",
  "email": "andi@karteji.id",
  "role": "Anggota Aktif",
  "photoUrl": "user-001-profile",
  "activityPoints": 245,
  "joinDate": "Januari 2023",
  "phone": "081234567890"
}
```

#### Collection: `events`
Document ID: auto-generated

```json
{
  "title": "Bakti Sosial Bersih Lingkungan",
  "description": "Kegiatan bersih-bersih lingkungan RT 01",
  "date": "15 Januari 2026",
  "time": "08:00 - 11:00",
  "location": "Jalan Utama RT 01",
  "category": "Bakti Sosial",
  "status": "Aktif",
  "attendees": 24,
  "photoUrl": "event-001",
  "createdAt": "2026-01-10T00:00:00Z"
}
```

#### Collection: `announcements`
Document ID: auto-generated

```json
{
  "title": "Pengumuman Iuran Bulanan",
  "message": "Pembayaran iuran bulan Januari telah dibuka",
  "type": "info",
  "createdAt": "2026-01-15T10:00:00Z",
  "isActive": true
}
```

#### Collection: `attendance`
Document ID: auto-generated

```json
{
  "userId": "user-001",
  "eventId": "event-123",
  "date": "2026-01-15T08:00:00Z",
  "status": "present",
  "month": 1,
  "year": 2026
}
```

#### Collection: `finance`
Document: `summary`

```json
{
  "balance": 2475000,
  "monthIncome": 725000,
  "monthExpenses": 550000,
  "lastUpdated": "2026-01-15T12:00:00Z"
}
```

#### Collection: `transactions`
Document ID: auto-generated

```json
{
  "type": "in",
  "description": "Iuran Bulanan Anggota",
  "amount": 450000,
  "date": "15 Jan 2026",
  "category": "iuran",
  "createdAt": "2026-01-15T09:00:00Z"
}
```

#### Collection: `voting`
Document ID: auto-generated (hanya 1 voting aktif)

```json
{
  "title": "Pemilihan Ketua Karang Taruna 2026-2028",
  "description": "Pilih calon ketua untuk periode 2026-2028",
  "endTime": "20 Januari 2026, 20:00",
  "isActive": true,
  "totalVoters": 45,
  "voters": ["user-001", "user-002"],
  "candidates": [
    {
      "id": "candidate-001",
      "name": "Andi Wijaya",
      "background": "Pelatih Olahraga",
      "photoUrl": "candidate-001",
      "votes": 18
    },
    {
      "id": "candidate-002",
      "name": "Siti Nurhaliza",
      "background": "Pengelola Keuangan",
      "photoUrl": "candidate-002",
      "votes": 15
    }
  ]
}
```

#### Collection: `monthlyFinance`
Document ID: `2026-01` (format: YYYY-MM)

```json
{
  "year": 2026,
  "month": 1,
  "income": 725000,
  "expenses": 550000,
  "balance": 175000
}
```

---

## 🔥 Cara Menambahkan Data via Firebase Console

### 1. Buka Firebase Console
https://console.firebase.google.com/project/katar-9cac3/firestore

### 2. Pilih Firestore Database

### 3. Klik "Start collection"
- Collection ID: `users`
- Document ID: `user-001`
- Field: `name`, Type: `string`, Value: `Andi Wijaya`
- Tambahkan field lainnya

### 4. Ulangi untuk collection lainnya

---

## ⚠️ PENTING - Yang Harus Diisi Minimal

### Untuk Dashboard berfungsi:
- ✅ 1 user di collection `users` dengan ID sesuai localStorage
- ✅ 1-2 events di collection `events`
- ✅ 1-2 announcements di collection `announcements`
- ✅ Data attendance untuk user tersebut

### Untuk Events berfungsi:
- ✅ Minimal 1 event di collection `events`

### Untuk Finance berfungsi:
- ✅ Document `summary` di collection `finance`
- ✅ Beberapa transactions di collection `transactions`
- ✅ Document bulan ini di collection `monthlyFinance`

### Untuk Voting berfungsi:
- ✅ 1 voting aktif dengan `isActive: true`
- ✅ Minimal 2 candidates

### Untuk Profile berfungsi:
- ✅ User data di collection `users`
- ✅ Foto profile di Cloudinary

---

## 🎨 Upload Foto ke Cloudinary

### Via Upload Widget (Console):
1. Login ke Cloudinary
2. Media Library → Upload
3. Upload foto
4. Set Public ID: `user-001-profile`
5. Folder: `karteji/` (optional)

### Via API (Programmatic):
```javascript
import { uploadToCloudinary } from './lib/cloudinary'

const file = document.querySelector('input[type="file"]').files[0]
const publicId = await uploadToCloudinary(file, 'user-001-profile')
```

---

## 🐛 Troubleshooting

### "Profile not found"
- Pastikan document `users/user-001` ada di Firestore
- Cek userId di localStorage sesuai dengan document ID

### "Finance data not found"
- Pastikan document `finance/summary` ada
- Pastikan ada document di `monthlyFinance` dengan ID bulan ini (format: `2026-01`)

### "Tidak ada voting aktif"
- Pastikan ada 1 document di collection `voting`
- Field `isActive` harus `true`

### Foto tidak muncul
- Cek public ID di Cloudinary sesuai dengan field `photoUrl` di Firestore
- Format URL: `https://res.cloudinary.com/dbxktcwug/image/upload/{publicId}`

---

## 📱 Testing

1. Set user ID:
```javascript
localStorage.setItem('karteji_userId', 'user-001')
```

2. Refresh aplikasi

3. Cek Console browser untuk error

4. Jika ada error "not found", tambahkan data yang sesuai ke Firestore

---

## 🎯 Quick Start (Minimum Viable Data)

Copy-paste structure ini ke Firebase Console:

### Collection: `users` → Document: `user-001`
```
name: "Andi Wijaya"
email: "andi@karteji.id"
role: "Anggota Aktif"
activityPoints: 245
joinDate: "Januari 2023"
photoUrl: "user-001-profile"
```

### Collection: `finance` → Document: `summary`
```
balance: 2475000
monthIncome: 725000
monthExpenses: 550000
```

### Collection: `monthlyFinance` → Document: `2026-01`
```
year: 2026
month: 1
income: 725000
expenses: 550000
balance: 175000
```

Dengan 3 document ini, Dashboard, Finance, dan Profile sudah bisa jalan!

---

**Selamat menggunakan KARTEJI! 🎉**
