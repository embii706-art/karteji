# 🔒 Firestore Security Rules - KARTEJI

Dokumentasi lengkap Firestore Security Rules untuk aplikasi KARTEJI dengan role-based access control (RBAC).

---

## 📋 Table of Contents

- [Role Hierarchy](#-role-hierarchy)
- [Helper Functions](#-helper-functions)
- [Collections & Permissions](#-collections--permissions)
- [Deployment](#-deployment)
- [Testing](#-testing)

---

## 👥 Role Hierarchy

### Core Admin (Admin Inti)
Memiliki akses penuh untuk approval dan manajemen tingkat tinggi:
- `super_admin` - Administrator tertinggi, full access
- `ketua` - Ketua Karang Taruna
- `wakil_ketua` - Wakil Ketua (ACC transaksi keuangan, kegiatan)

### Pengurus (BPH + Koordinator)
Mengelola operasional harian:
- `sekretaris` - Administrasi, surat, arsip, notulen
- `bendahara` - Keuangan, transaksi
- `koordinator` - Arisan, inventory, polling

### Anggota
- `anggota` - Member biasa (read access, vote, attendance)

---

## 🔧 Helper Functions

### `getUserRole()`
Mengambil role dari dokumen user berdasarkan `request.auth.uid`.

### `isRole(roleName)`
Cek apakah user memiliki role tertentu.

**Example:**
```javascript
isRole('bendahara') // true jika user adalah bendahara
```

### `isCoreAdmin()`
Cek apakah user adalah admin inti (super_admin, ketua, wakil_ketua).

**Use Case:**
- Approval transaksi keuangan
- Update status kegiatan
- Delete critical data

### `isPengurus()`
Cek apakah user adalah pengurus (BPH + Koordinator).

**Use Case:**
- Membuat kegiatan baru
- Posting pengumuman
- Manage inventory

---

## 📦 Collections & Permissions

### 1. **users** - Data Pengguna

| Operation | Permission |
|-----------|-----------|
| **Read** | ✅ Authenticated users |
| **Create** | ✅ User sendiri (self-registration) |
| **Update** | ✅ User sendiri atau Core Admin |
| **Delete** | 🔒 Super Admin only |

**Data Structure:**
```javascript
{
  name: string,
  email: string,
  phone: string,
  address: string,
  role: 'anggota' | 'koordinator' | 'sekretaris' | 'bendahara' | 'wakil_ketua' | 'ketua' | 'super_admin',
  activityPoints: number,
  joinDate: string,
  createdAt: Timestamp,
  isActive: boolean
}
```

---

### 2. **financial_records** - Catatan Keuangan

| Operation | Permission |
|-----------|-----------|
| **Read** | ✅ Authenticated users (transparansi) |
| **Create** | 🔒 Bendahara atau Core Admin |
| **Update** | 🔒 Bendahara atau Core Admin (ACC) |
| **Delete** | 🔒 Bendahara atau Super Admin |

**Use Case:**
- Bendahara input transaksi
- Wakil Ketua/Ketua ACC transaksi besar
- Semua anggota bisa lihat untuk transparansi

**Data Structure:**
```javascript
{
  type: 'income' | 'expense',
  amount: number,
  description: string,
  category: string,
  date: Timestamp,
  approvedBy: string (uid),
  status: 'pending' | 'approved' | 'rejected',
  createdAt: Timestamp
}
```

---

### 3. **activities** - Kegiatan

| Operation | Permission |
|-----------|-----------|
| **Read** | ✅ Public (untuk upcoming events) |
| **Create** | 🔒 Pengurus |
| **Update** | 🔒 Pengurus (update status, ACC) |
| **Delete** | 🔒 Pengurus |

**Use Case:**
- Sekretaris/Koordinator buat kegiatan
- Wakil Ketua ACC kegiatan
- Anggota bisa lihat dan daftar

**Data Structure:**
```javascript
{
  title: string,
  description: string,
  date: string,
  time: string,
  location: string,
  category: 'Bakti Sosial' | 'Olahraga' | 'Rapat' | 'Pelatihan',
  status: 'pending' | 'approved' | 'cancelled',
  participants: number,
  maxParticipants: number,
  attendees: [uid],
  createdBy: string (uid),
  approvedBy: string (uid),
  createdAt: Timestamp
}
```

---

### 4. **arisan_history** - Riwayat Arisan

| Operation | Permission |
|-----------|-----------|
| **Read** | ✅ Authenticated users |
| **Write** | 🔒 Koordinator atau Core Admin |

**Data Structure:**
```javascript
{
  period: string,
  winner: string (uid),
  amount: number,
  date: Timestamp,
  status: 'completed' | 'pending'
}
```

---

### 5. **inventory** - Inventaris Barang

| Operation | Permission |
|-----------|-----------|
| **Read** | ✅ Authenticated users |
| **Write** | 🔒 Koordinator atau Core Admin |

**Data Structure:**
```javascript
{
  name: string,
  quantity: number,
  condition: 'baik' | 'rusak' | 'hilang',
  location: string,
  purchaseDate: Timestamp,
  value: number,
  photo: string (url),
  updatedAt: Timestamp
}
```

---

### 6. **notifications** / **announcements** - Pengumuman

| Operation | Permission |
|-----------|-----------|
| **Read** | ✅ Public |
| **Create** | 🔒 Pengurus |
| **Delete** | 🔒 Pengurus |

**Data Structure:**
```javascript
{
  title: string,
  message: string,
  type: 'info' | 'warning' | 'success' | 'urgent',
  priority: 'low' | 'medium' | 'high',
  createdBy: string (uid),
  createdAt: Timestamp,
  expiresAt: Timestamp
}
```

---

### 7. **polls** / **votings** - Voting/Musyawarah

| Operation | Permission |
|-----------|-----------|
| **Read** | ✅ Authenticated users |
| **Create** | 🔒 Koordinator atau Core Admin |
| **Update** | ✅ Authenticated users (untuk vote) |
| **Delete** | 🔒 Koordinator atau Core Admin |

**Use Case:**
- Koordinator buat polling
- Anggota vote (1 user = 1 vote)
- Results transparant

**Data Structure:**
```javascript
{
  title: string,
  description: string,
  deadline: Timestamp,
  candidates: [
    {
      id: string,
      name: string,
      image: string (url),
      slogan: string,
      votes: number
    }
  ],
  totalVoters: number,
  voters: [uid], // Track who voted
  status: 'active' | 'closed',
  createdBy: string (uid),
  createdAt: Timestamp
}
```

---

### 8. **archives** - Arsip Dokumen

| Operation | Permission |
|-----------|-----------|
| **Read** | ✅ Authenticated users |
| **Write** | 🔒 Sekretaris atau Core Admin |

**Data Structure:**
```javascript
{
  title: string,
  type: 'document' | 'photo' | 'video',
  fileUrl: string,
  description: string,
  tags: [string],
  uploadedBy: string (uid),
  uploadedAt: Timestamp
}
```

---

### 9. **letters** - Surat Menyurat

| Operation | Permission |
|-----------|-----------|
| **Read** | ✅ Authenticated users |
| **Write** | 🔒 Sekretaris atau Core Admin |

**Data Structure:**
```javascript
{
  letterNumber: string,
  subject: string,
  recipient: string,
  sender: string,
  content: string,
  fileUrl: string,
  type: 'keluar' | 'masuk',
  date: Timestamp,
  status: 'draft' | 'sent' | 'received',
  createdBy: string (uid)
}
```

---

### 10. **minutes** - Notulensi Rapat

| Operation | Permission |
|-----------|-----------|
| **Read** | ✅ Authenticated users |
| **Write** | 🔒 Sekretaris atau Core Admin |

**Data Structure:**
```javascript
{
  meetingTitle: string,
  meetingDate: Timestamp,
  location: string,
  attendees: [uid],
  agenda: [string],
  decisions: [string],
  notes: string,
  attachments: [string], // urls
  createdBy: string (uid),
  approvedBy: string (uid)
}
```

---

### 11. **gathering_history** - Titik Kumpul

| Operation | Permission |
|-----------|-----------|
| **Read** | ✅ Authenticated users |
| **Write** | 🔒 Bendahara atau Core Admin |

**Use Case:**
- Track dana titik kumpul (iuran rutin RT)
- Bendahara catat kontribusi

**Data Structure:**
```javascript
{
  period: string, // "Januari 2026"
  contributors: [
    {
      uid: string,
      name: string,
      amount: number,
      paidAt: Timestamp
    }
  ],
  totalCollected: number,
  target: number,
  status: 'ongoing' | 'completed'
}
```

---

### 12. **events** - Kegiatan (Existing App)

| Operation | Permission |
|-----------|-----------|
| **Read** | ✅ Public |
| **Create** | 🔒 Pengurus |
| **Update** | 🔒 Pengurus |
| **Delete** | 🔒 Core Admin |

Same as **activities**, digunakan oleh aplikasi existing.

---

### 13. **finances** - Keuangan (Existing App)

| Operation | Permission |
|-----------|-----------|
| **Read** | ✅ Authenticated users |
| **Create/Update** | 🔒 Bendahara atau Core Admin |
| **Delete** | 🔒 Super Admin only |

Same as **financial_records**, digunakan oleh aplikasi existing untuk transparansi kas.

---

## 🚀 Deployment

### 1. Via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **katar-9cac3**
3. Sidebar → **Firestore Database**
4. Tab **Rules**
5. Copy paste content dari `firestore.rules`
6. Click **Publish**

### 2. Via Firebase CLI

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (jika belum)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

### 3. Verify Deployment

```bash
# Check deployed rules
firebase firestore:rules get

# Test rules (coming soon)
firebase emulators:start --only firestore
```

---

## 🧪 Testing

### Test Cases

#### 1. User Registration (Public)
```javascript
// ✅ SHOULD PASS
// Siapa saja bisa daftar
allow create: if request.auth != null && uid == request.auth.uid;
```

#### 2. Bendahara Input Transaksi
```javascript
// ✅ SHOULD PASS
// Bendahara buat financial_record
allow create: if isRole('bendahara');
```

#### 3. Wakil Ketua ACC Transaksi
```javascript
// ✅ SHOULD PASS
// Wakil Ketua update status → approved
allow update: if isCoreAdmin();
```

#### 4. Anggota Biasa Lihat Keuangan
```javascript
// ✅ SHOULD PASS
// Transparansi untuk semua
allow read: if request.auth != null;
```

#### 5. Anggota Biasa Edit Keuangan
```javascript
// ❌ SHOULD FAIL
// Hanya bendahara/admin
allow update: if isRole('bendahara') || isCoreAdmin();
```

#### 6. Sekretaris Buat Surat
```javascript
// ✅ SHOULD PASS
allow write: if isRole('sekretaris') || isCoreAdmin();
```

#### 7. Koordinator Buat Polling
```javascript
// ✅ SHOULD PASS
allow create: if isRole('koordinator') || isCoreAdmin();
```

#### 8. Anggota Vote di Polling
```javascript
// ✅ SHOULD PASS
// Semua authenticated user bisa vote
allow update: if request.auth != null;
```

---

## ⚠️ Important Notes

### 1. Initial Super Admin Setup

Setelah deploy rules, **TIDAK ADA** yang bisa update role user karena:
```javascript
allow update: if request.auth != null && (uid == request.auth.uid || isCoreAdmin());
```

**Solution:** Manual setup first super_admin via Firebase Console:

1. Go to Firestore Database
2. Collection: `users`
3. Select admin user document
4. Edit field `role` → `super_admin`
5. Save

Setelah itu, super_admin bisa assign role lain.

### 2. Role Migration

Jika user sudah ada dengan role lama:
- Update manual di Firebase Console
- Atau buat script migration:

```javascript
// migration-script.js
const admin = require('firebase-admin');
const db = admin.firestore();

async function migrateRoles() {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();
  
  const batch = db.batch();
  
  snapshot.forEach(doc => {
    const oldRole = doc.data().role;
    let newRole = 'anggota'; // default
    
    // Map old roles to new
    if (oldRole === 'Ketua') newRole = 'ketua';
    if (oldRole === 'Bendahara') newRole = 'bendahara';
    // ... dst
    
    batch.update(doc.ref, { role: newRole });
  });
  
  await batch.commit();
  console.log('Migration complete!');
}

migrateRoles();
```

### 3. Security Best Practices

✅ **DO:**
- Always check `request.auth != null` untuk authenticated access
- Use helper functions untuk reusable logic
- Limit delete operations (data safety)
- Enable read untuk transparansi (keuangan, kegiatan)

❌ **DON'T:**
- `allow read, write: if true;` (terlalu permissive)
- Hardcode UIDs di rules
- Skip role validation
- Allow anonymous writes

---

## 📞 Support

Jika ada issue dengan rules:

1. Check Firebase Console → Firestore → Rules tab
2. Check error di Console logs
3. Test dengan Firebase Emulator
4. Contact: admin@karteji.id

---

**Last Updated:** January 15, 2026  
**Version:** 2.0  
**Status:** ✅ Production Ready
