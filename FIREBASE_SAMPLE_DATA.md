# KARTEJI - Firebase Sample Data Setup Guide

This guide will help you populate your Firebase Firestore database with sample data for testing KARTEJI.

## Prerequisites

1. Firebase Console access: https://console.firebase.google.com
2. Project: `katar-9cac3`
3. Firestore Database enabled

## Sample Data Collection

### 1. Users Collection

Add these documents to the `users` collection:

```json
{
  "userId": "demo-user-001",
  "data": {
    "name": "Andi Wijaya",
    "email": "andi.wijaya@example.com",
    "phone": "08123456789",
    "role": "Anggota Aktif",
    "status": "active",
    "photoUrl": "karteji-user-001",
    "activityPoints": 245,
    "joinDate": "2023-01-15",
    "createdAt": 1642262400000,
    "updatedAt": 1642262400000
  }
}
```

```json
{
  "userId": "demo-user-002",
  "data": {
    "name": "Siti Nurhaliza",
    "email": "siti.nurhaliza@example.com",
    "phone": "08234567890",
    "role": "Pengurus Keuangan",
    "status": "active",
    "photoUrl": "karteji-user-002",
    "activityPoints": 320,
    "joinDate": "2022-08-20",
    "createdAt": 1661007600000,
    "updatedAt": 1661007600000
  }
}
```

```json
{
  "userId": "demo-user-003",
  "data": {
    "name": "Budi Santoso",
    "email": "budi.santoso@example.com",
    "phone": "08345678901",
    "role": "Koordinator Program",
    "status": "active",
    "photoUrl": "karteji-user-003",
    "activityPoints": 290,
    "joinDate": "2023-03-10",
    "createdAt": 1678452000000,
    "updatedAt": 1678452000000
  }
}
```

### 2. Events Collection

Add these documents to the `events` collection:

```json
{
  "eventId": "event-001",
  "data": {
    "title": "Bakti Sosial Bersih Lingkungan",
    "description": "Kegiatan pembersihan lingkungan RT 05 bersama-sama",
    "date": "2025-01-15",
    "time": "08:00 - 11:00",
    "location": "Jalan Utama RT 05",
    "category": "Bakti Sosial",
    "photoUrl": "karteji-event-001",
    "status": "active",
    "createdBy": "demo-user-003",
    "createdAt": 1739539200000
  }
}
```

Then create a subcollection `attendees` under `events/event-001`:

```json
{
  "docId": "attendee-001",
  "data": {
    "userId": "demo-user-001",
    "registeredAt": 1739539200000,
    "status": "registered"
  }
}
```

```json
{
  "eventId": "event-002",
  "data": {
    "title": "Olahraga Rutin - Futsal",
    "description": "Pertandingan futsal bulanan antar RT",
    "date": "2025-01-17",
    "time": "19:00 - 21:00",
    "location": "Lapangan Futsal Komplek",
    "category": "Olahraga",
    "photoUrl": "karteji-event-002",
    "status": "active",
    "createdBy": "demo-user-003",
    "createdAt": 1739712000000
  }
}
```

```json
{
  "eventId": "event-003",
  "data": {
    "title": "Rapat Bulanan Karang Taruna",
    "description": "Membahas program kerja dan evaluasi bulan lalu",
    "date": "2025-01-18",
    "time": "20:00 - 21:30",
    "location": "Rumah Ketua RT 05",
    "category": "Rapat",
    "photoUrl": "karteji-event-003",
    "status": "active",
    "createdBy": "demo-user-003",
    "createdAt": 1739798400000
  }
}
```

### 3. Announcements Collection

Add these documents to the `announcements` collection:

```json
{
  "announcementId": "ann-001",
  "data": {
    "title": "Survei Kepuasan Anggota",
    "content": "Mohon isi survei kepuasan layanan Karang Taruna untuk meningkatkan kualitas kami. Waktu pengisian maksimal 5 menit.",
    "type": "info",
    "status": "published",
    "photoUrl": "karteji-ann-001",
    "createdBy": "demo-user-003",
    "createdAt": 1739798400000,
    "publishedAt": 1739798400000,
    "updatedAt": 1739798400000
  }
}
```

```json
{
  "announcementId": "ann-002",
  "data": {
    "title": "Pendaftaran Kegiatan Ditutup",
    "content": "Pendaftaran olahraga rutin ditutup hari Jumat pukul 17:00. Silakan daftarkan diri Anda sebelum batas waktu.",
    "type": "warning",
    "status": "published",
    "photoUrl": "karteji-ann-002",
    "createdBy": "demo-user-002",
    "createdAt": 1739625600000,
    "publishedAt": 1739625600000,
    "updatedAt": 1739625600000
  }
}
```

### 4. Voting Collection

Add this document to the `voting` collection:

```json
{
  "votingId": "voting-001",
  "data": {
    "title": "Pemilihan Ketua Karang Taruna Periode 2025-2027",
    "description": "Silakan pilih calon ketua Karang Taruna yang Anda dukung",
    "type": "election",
    "status": "active",
    "startDate": 1739712000000,
    "endDate": 1740057600000,
    "createdAt": 1739625600000,
    "candidates": [
      {
        "id": "cand-001",
        "name": "Andi Wijaya",
        "description": "Pelatih Olahraga, berpengalaman dalam program sosial",
        "photoUrl": "karteji-user-001"
      },
      {
        "id": "cand-002",
        "name": "Siti Nurhaliza",
        "description": "Pengelola Keuangan, transparan dalam pencatatan",
        "photoUrl": "karteji-user-002"
      },
      {
        "id": "cand-003",
        "name": "Budi Santoso",
        "description": "Koordinator Program, visioner dan dinamis",
        "photoUrl": "karteji-user-003"
      }
    ]
  }
}
```

Then create a subcollection `votes` under `voting/voting-001`:

```json
{
  "docId": "vote-001",
  "data": {
    "userId": "demo-user-001",
    "candidateId": "cand-001",
    "votedAt": 1739798400000
  }
}
```

```json
{
  "docId": "vote-002",
  "data": {
    "userId": "demo-user-002",
    "candidateId": "cand-002",
    "votedAt": 1739798401000
  }
}
```

### 5. Finance Collection

Create a document in `finance` collection:

```json
{
  "docId": "summary",
  "data": {
    "balance": 2475000,
    "totalIncome": 5200000,
    "totalExpenses": 2725000,
    "lastUpdated": 1739798400000,
    "bank": {
      "accountName": "Karang Taruna RT 05",
      "accountNumber": "1234567890",
      "bankName": "BNI"
    }
  }
}
```

### 6. Transactions Collection

Add these documents to the `transactions` collection:

```json
{
  "transactionId": "txn-001",
  "data": {
    "type": "in",
    "description": "Iuran Bulanan Anggota",
    "amount": 450000,
    "date": 1739539200000,
    "category": "Iuran",
    "recordedBy": "demo-user-002",
    "receipt": "karteji-receipt-001",
    "createdAt": 1739539200000
  }
}
```

```json
{
  "transactionId": "txn-002",
  "data": {
    "type": "in",
    "description": "Donasi Bakti Sosial",
    "amount": 200000,
    "date": 1739452800000,
    "category": "Donasi",
    "recordedBy": "demo-user-002",
    "receipt": "karteji-receipt-002",
    "createdAt": 1739452800000
  }
}
```

```json
{
  "transactionId": "txn-003",
  "data": {
    "type": "out",
    "description": "Pembelian Perlengkapan Olahraga",
    "amount": 150000,
    "date": 1739366400000,
    "category": "Perlengkapan",
    "recordedBy": "demo-user-002",
    "receipt": "karteji-receipt-003",
    "createdAt": 1739366400000
  }
}
```

```json
{
  "transactionId": "txn-004",
  "data": {
    "type": "out",
    "description": "Hadiah Juara Turnamen",
    "amount": 300000,
    "date": 1739280000000,
    "category": "Penghargaan",
    "recordedBy": "demo-user-002",
    "receipt": "karteji-receipt-004",
    "createdAt": 1739280000000
  }
}
```

### 7. Attendance Collection

Add these documents to the `attendance` collection:

```json
{
  "attendanceId": "att-001",
  "data": {
    "userId": "demo-user-001",
    "eventId": "event-001",
    "date": 1739539200000,
    "status": "present",
    "recordedAt": 1739539200000
  }
}
```

```json
{
  "attendanceId": "att-002",
  "data": {
    "userId": "demo-user-001",
    "eventId": "event-002",
    "date": 1739625600000,
    "status": "registered",
    "recordedAt": 1739625600000
  }
}
```

## Cloudinary Image Upload

To use actual profile photos instead of emoji placeholders:

1. Go to Cloudinary Dashboard: https://cloudinary.com/console
2. Upload images with these public IDs:
   - `karteji-user-001` (Andi's photo)
   - `karteji-user-002` (Siti's photo)
   - `karteji-user-003` (Budi's photo)
   - `karteji-event-001` (Event 1 photo)
   - `karteji-event-002` (Event 2 photo)
   - `karteji-event-003` (Event 3 photo)

3. Images will automatically be optimized via transformation URLs

## Testing the Integration

After adding the data:

1. Open the app at `http://localhost:3000`
2. Navigate through each screen:
   - **Dashboard**: Should show Andi's profile with 245 points
   - **Events**: Should show 3 active events
   - **Voting**: Should show election with 3 candidates
   - **Finance**: Should show 2,475,000 balance
   - **Profile**: Should display current user data

## Updating Data

To edit any document:
1. Go to Firebase Console
2. Select `katar-9cac3` project
3. Open Firestore Database
4. Click on collection → document
5. Edit fields directly

Changes will automatically reflect in the app!

## Tips for Production

- [ ] Remove demo user IDs
- [ ] Add real member data
- [ ] Upload actual member photos to Cloudinary
- [ ] Setup proper authentication
- [ ] Enable Firestore backup
- [ ] Configure security rules
- [ ] Test offline mode
- [ ] Monitor database size and usage
