/**
 * Script untuk populate Firebase dengan data awal
 * Usage: node scripts/seedFirebase.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, Timestamp } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAQxpD7ea9gHWGiU3wYXr0XHyl-SNyFYNs",
  authDomain: "katar-9cac3.firebaseapp.com",
  projectId: "katar-9cac3",
  storageBucket: "katar-9cac3.firebasestorage.app",
  messagingSenderId: "1017734829960",
  appId: "1:1017734829960:web:6b02b7176f08a23ce28c3d",
  measurementId: "G-M4F9J10TTE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample Data
const sampleData = {
  // USERS - 5 sample users dengan berbagai role
  users: [
    {
      id: 'user-1737800000001',
      name: 'Ahmad Fauzi',
      email: 'ahmad@karteji.id',
      phone: '08123456789',
      address: 'Jl. Mawar No. 12 RT 01',
      role: 'super_admin',
      activityPoints: 150,
      joinDate: '2023-06-15',
      createdAt: Timestamp.now(),
      isActive: true,
      photoUrl: 'https://res.cloudinary.com/dbxktcwug/image/upload/v1/karteji/ahmad.jpg'
    },
    {
      id: 'user-1737800000002',
      name: 'Siti Nurhaliza',
      email: 'siti@karteji.id',
      phone: '08234567890',
      address: 'Jl. Melati No. 8 RT 01',
      role: 'bendahara',
      activityPoints: 120,
      joinDate: '2023-07-20',
      createdAt: Timestamp.now(),
      isActive: true,
      photoUrl: 'https://res.cloudinary.com/dbxktcwug/image/upload/v1/karteji/siti.jpg'
    },
    {
      id: 'user-1737800000003',
      name: 'Budi Santoso',
      email: 'budi@karteji.id',
      phone: '08345678901',
      address: 'Jl. Anggrek No. 5 RT 01',
      role: 'sekretaris',
      activityPoints: 100,
      joinDate: '2023-08-10',
      createdAt: Timestamp.now(),
      isActive: true,
      photoUrl: 'https://res.cloudinary.com/dbxktcwug/image/upload/v1/karteji/budi.jpg'
    },
    {
      id: 'user-1737800000004',
      name: 'Dewi Lestari',
      email: 'dewi@karteji.id',
      phone: '08456789012',
      address: 'Jl. Dahlia No. 3 RT 01',
      role: 'koordinator',
      activityPoints: 85,
      joinDate: '2023-09-05',
      createdAt: Timestamp.now(),
      isActive: true,
      photoUrl: 'https://res.cloudinary.com/dbxktcwug/image/upload/v1/karteji/dewi.jpg'
    },
    {
      id: 'user-1737800000005',
      name: 'Eko Prasetyo',
      email: 'eko@karteji.id',
      phone: '08567890123',
      address: 'Jl. Kenanga No. 15 RT 01',
      role: 'anggota',
      activityPoints: 60,
      joinDate: '2023-10-12',
      createdAt: Timestamp.now(),
      isActive: true,
      photoUrl: 'https://res.cloudinary.com/dbxktcwug/image/upload/v1/karteji/eko.jpg'
    }
  ],

  // EVENTS - 5 kegiatan upcoming
  events: [
    {
      id: 'event-001',
      title: 'Bakti Sosial Bersih Lingkungan',
      description: 'Kegiatan bersih-bersih lingkungan RT 01 bersama seluruh warga',
      date: '2026-01-25',
      time: '08:00 - 11:00',
      location: 'Jalan Utama RT 01',
      category: 'Bakti Sosial',
      status: 'approved',
      participants: 24,
      maxParticipants: 50,
      attendees: ['user-1737800000001', 'user-1737800000002', 'user-1737800000003'],
      createdBy: 'user-1737800000001',
      approvedBy: 'user-1737800000001',
      createdAt: Timestamp.now()
    },
    {
      id: 'event-002',
      title: 'Senam Pagi Rutin',
      description: 'Senam pagi bersama untuk menjaga kesehatan warga RT 01',
      date: '2026-01-20',
      time: '06:00 - 07:30',
      location: 'Lapangan RT 01',
      category: 'Olahraga',
      status: 'approved',
      participants: 18,
      maxParticipants: 30,
      attendees: ['user-1737800000002', 'user-1737800000004'],
      createdBy: 'user-1737800000003',
      approvedBy: 'user-1737800000001',
      createdAt: Timestamp.now()
    },
    {
      id: 'event-003',
      title: 'Rapat Koordinasi Bulanan',
      description: 'Rapat evaluasi program bulan Januari dan perencanaan Februari',
      date: '2026-01-28',
      time: '19:00 - 21:00',
      location: 'Balai RT 01',
      category: 'Rapat',
      status: 'approved',
      participants: 12,
      maxParticipants: 20,
      attendees: ['user-1737800000001', 'user-1737800000002', 'user-1737800000003', 'user-1737800000004'],
      createdBy: 'user-1737800000001',
      approvedBy: 'user-1737800000001',
      createdAt: Timestamp.now()
    },
    {
      id: 'event-004',
      title: 'Pelatihan Digital Marketing',
      description: 'Workshop digital marketing untuk UMKM warga RT 01',
      date: '2026-02-05',
      time: '13:00 - 16:00',
      location: 'Balai RT 01',
      category: 'Pelatihan',
      status: 'pending',
      participants: 8,
      maxParticipants: 25,
      attendees: ['user-1737800000005'],
      createdBy: 'user-1737800000004',
      createdAt: Timestamp.now()
    },
    {
      id: 'event-005',
      title: 'Turnamen Futsal RT 01',
      description: 'Kompetisi futsal antar RW untuk meningkatkan kebersamaan',
      date: '2026-02-10',
      time: '14:00 - 18:00',
      location: 'Lapangan Futsal Kecamatan',
      category: 'Olahraga',
      status: 'approved',
      participants: 15,
      maxParticipants: 40,
      attendees: ['user-1737800000001', 'user-1737800000005'],
      createdBy: 'user-1737800000004',
      approvedBy: 'user-1737800000001',
      createdAt: Timestamp.now()
    }
  ],

  // VOTINGS - 2 voting session
  votings: [
    {
      id: 'vote-001',
      title: 'Pemilihan Ketua Karang Taruna 2026',
      description: 'Silakan pilih kandidat Ketua Karang Taruna RT 01 periode 2026-2027',
      deadline: Timestamp.fromDate(new Date('2026-01-30')),
      status: 'active',
      candidates: [
        {
          id: 'cand-001',
          name: 'Ahmad Fauzi',
          image: 'https://res.cloudinary.com/dbxktcwug/image/upload/v1/karteji/ahmad.jpg',
          slogan: 'Pemuda Aktif, RT Produktif!',
          votes: 12
        },
        {
          id: 'cand-002',
          name: 'Budi Santoso',
          image: 'https://res.cloudinary.com/dbxktcwug/image/upload/v1/karteji/budi.jpg',
          slogan: 'Bersama Membangun RT yang Maju',
          votes: 8
        }
      ],
      totalVoters: 20,
      voters: ['user-1737800000003', 'user-1737800000004', 'user-1737800000005'],
      createdBy: 'user-1737800000004',
      createdAt: Timestamp.now()
    },
    {
      id: 'vote-002',
      title: 'Pilih Program Prioritas Februari',
      description: 'Tentukan program yang paling dibutuhkan warga RT 01 bulan depan',
      deadline: Timestamp.fromDate(new Date('2026-01-22')),
      status: 'active',
      candidates: [
        {
          id: 'prog-001',
          name: 'Renovasi Balai RT',
          image: 'https://res.cloudinary.com/dbxktcwug/image/upload/v1/karteji/balai.jpg',
          slogan: 'Balai yang Nyaman untuk Kegiatan Bersama',
          votes: 15
        },
        {
          id: 'prog-002',
          name: 'Pengadaan Kursi Tenda',
          image: 'https://res.cloudinary.com/dbxktcwug/image/upload/v1/karteji/tenda.jpg',
          slogan: 'Untuk Acara Warga yang Lebih Meriah',
          votes: 10
        },
        {
          id: 'prog-003',
          name: 'Lampu Jalan RT',
          image: 'https://res.cloudinary.com/dbxktcwug/image/upload/v1/karteji/lampu.jpg',
          slogan: 'RT yang Terang, Aman dan Nyaman',
          votes: 18
        }
      ],
      totalVoters: 43,
      voters: ['user-1737800000001', 'user-1737800000002'],
      createdBy: 'user-1737800000001',
      createdAt: Timestamp.now()
    }
  ],

  // FINANCES - Data keuangan
  finances: [
    {
      id: 'finance-001',
      balance: 5430000,
      thisMonthIncome: 850000,
      thisMonthExpenses: 420000,
      transactions: [
        {
          id: 'tx-001',
          date: '2026-01-15',
          description: 'Iuran Bulanan Januari',
          type: 'IN',
          amount: 500000,
          category: 'Iuran',
          status: 'approved',
          createdBy: 'user-1737800000002',
          approvedBy: 'user-1737800000001'
        },
        {
          id: 'tx-002',
          date: '2026-01-12',
          description: 'Pembelian Konsumsi Rapat',
          type: 'OUT',
          amount: 150000,
          category: 'Operasional',
          status: 'approved',
          createdBy: 'user-1737800000002',
          approvedBy: 'user-1737800000001'
        },
        {
          id: 'tx-003',
          date: '2026-01-10',
          description: 'Dana Sosial dari Donatur',
          type: 'IN',
          amount: 200000,
          category: 'Donasi',
          status: 'approved',
          createdBy: 'user-1737800000002',
          approvedBy: 'user-1737800000001'
        },
        {
          id: 'tx-004',
          date: '2026-01-08',
          description: 'Pembelian Alat Kebersihan',
          type: 'OUT',
          amount: 120000,
          category: 'Peralatan',
          status: 'approved',
          createdBy: 'user-1737800000002',
          approvedBy: 'user-1737800000001'
        },
        {
          id: 'tx-005',
          date: '2026-01-05',
          description: 'Hasil Arisan Januari',
          type: 'IN',
          amount: 150000,
          category: 'Arisan',
          status: 'approved',
          createdBy: 'user-1737800000002',
          approvedBy: 'user-1737800000001'
        },
        {
          id: 'tx-006',
          date: '2026-01-03',
          description: 'Pembayaran Listrik Balai',
          type: 'OUT',
          amount: 150000,
          category: 'Utilitas',
          status: 'approved',
          createdBy: 'user-1737800000002',
          approvedBy: 'user-1737800000001'
        }
      ],
      updatedAt: Timestamp.now()
    }
  ],

  // ANNOUNCEMENTS - Pengumuman
  announcements: [
    {
      id: 'announce-001',
      title: 'Iuran Bulanan Februari Dibuka',
      message: 'Iuran RT 01 bulan Februari sudah bisa dibayarkan. Silakan setor ke Bendahara paling lambat tanggal 25 Januari 2026.',
      type: 'info',
      priority: 'high',
      createdBy: 'user-1737800000002',
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(new Date('2026-01-25'))
    },
    {
      id: 'announce-002',
      title: 'Jadwal Kerja Bakti Minggu Ini',
      message: 'Kerja bakti bersih lingkungan akan dilaksanakan Sabtu, 25 Januari 2026 pukul 08.00 WIB. Harap semua warga hadir.',
      type: 'warning',
      priority: 'high',
      createdBy: 'user-1737800000001',
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(new Date('2026-01-25'))
    },
    {
      id: 'announce-003',
      title: 'Selamat kepada Pemenang Arisan',
      message: 'Selamat kepada Ibu Dewi Lestari yang menjadi pemenang arisan RT 01 periode Januari 2026!',
      type: 'success',
      priority: 'medium',
      createdBy: 'user-1737800000002',
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(new Date('2026-02-01'))
    }
  ]
};

// Function to seed data
async function seedFirebase() {
  console.log('🌱 Starting Firebase seed...\n');

  try {
    // Seed Users
    console.log('👥 Seeding Users...');
    for (const user of sampleData.users) {
      await setDoc(doc(db, 'users', user.id), user);
      console.log(`  ✅ Created user: ${user.name} (${user.role})`);
    }

    // Seed Events
    console.log('\n📅 Seeding Events...');
    for (const event of sampleData.events) {
      await setDoc(doc(db, 'events', event.id), event);
      console.log(`  ✅ Created event: ${event.title}`);
    }

    // Seed Votings
    console.log('\n🗳️  Seeding Votings...');
    for (const voting of sampleData.votings) {
      await setDoc(doc(db, 'votings', voting.id), voting);
      console.log(`  ✅ Created voting: ${voting.title}`);
    }

    // Seed Finances
    console.log('\n💰 Seeding Finances...');
    for (const finance of sampleData.finances) {
      await setDoc(doc(db, 'finances', finance.id), finance);
      console.log(`  ✅ Created finance record`);
    }

    // Seed Announcements
    console.log('\n📢 Seeding Announcements...');
    for (const announcement of sampleData.announcements) {
      await setDoc(doc(db, 'announcements', announcement.id), announcement);
      console.log(`  ✅ Created announcement: ${announcement.title}`);
    }

    console.log('\n✅ Firebase seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Users: ${sampleData.users.length}`);
    console.log(`  - Events: ${sampleData.events.length}`);
    console.log(`  - Votings: ${sampleData.votings.length}`);
    console.log(`  - Finances: ${sampleData.finances.length}`);
    console.log(`  - Announcements: ${sampleData.announcements.length}`);
    
    console.log('\n🔑 Test Login Credentials:');
    console.log('  Admin: ahmad@karteji.id');
    console.log('  Bendahara: siti@karteji.id');
    console.log('  Sekretaris: budi@karteji.id');
    console.log('  Koordinator: dewi@karteji.id');
    console.log('  Anggota: eko@karteji.id');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding Firebase:', error);
    process.exit(1);
  }
}

// Run seed
seedFirebase();
