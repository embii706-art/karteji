const PlaceholderPage = ({ title, icon, description }) => (
  <div className="max-w-2xl mx-auto text-center py-12 animate-fade-in">
    <div className="text-6xl mb-4">{icon}</div>
    <h1 className="text-3xl font-bold mb-3">{title}</h1>
    <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
    <div className="card max-w-md mx-auto">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Halaman ini sedang dalam tahap pengembangan.
        Fitur lengkap akan tersedia segera.
      </p>
    </div>
  </div>
)

// Individual placeholder pages
export const Profile = () => (
  <PlaceholderPage
    icon="👤"
    title="Profil Saya"
    description="Kelola informasi pribadi dan pengaturan akun Anda"
  />
)

export const Members = () => (
  <PlaceholderPage
    icon="👥"
    title="Daftar Anggota"
    description="Lihat dan kelola anggota organisasi"
  />
)

export const MemberDetail = () => (
  <PlaceholderPage
    icon="📋"
    title="Detail Anggota"
    description="Informasi lengkap anggota"
  />
)

export const Activities = () => (
  <PlaceholderPage
    icon="📅"
    title="Kegiatan"
    description="Daftar kegiatan dan acara organisasi"
  />
)

export const ActivityDetail = () => (
  <PlaceholderPage
    icon="📝"
    title="Detail Kegiatan"
    description="Informasi lengkap kegiatan"
  />
)

export const Attendance = () => (
  <PlaceholderPage
    icon="✅"
    title="Absensi"
    description="Kelola dan pantau kehadiran anggota"
  />
)

export const AttendanceScan = () => (
  <PlaceholderPage
    icon="📷"
    title="Scan QR Absensi"
    description="Scan QR code untuk mencatat kehadiran"
  />
)

export const Announcements = () => (
  <PlaceholderPage
    icon="📢"
    title="Pengumuman"
    description="Pengumuman dan informasi penting"
  />
)

export const Finance = () => (
  <PlaceholderPage
    icon="💰"
    title="Keuangan"
    description="Transparansi keuangan organisasi"
  />
)

export const Aspirations = () => (
  <PlaceholderPage
    icon="💡"
    title="Aspirasi & Voting"
    description="Sampaikan ide dan berikan suara"
  />
)

export const Settings = () => (
  <PlaceholderPage
    icon="⚙️"
    title="Pengaturan"
    description="Atur preferensi aplikasi"
  />
)

export const NotFound = () => (
  <PlaceholderPage
    icon="🔍"
    title="Halaman Tidak Ditemukan"
    description="Halaman yang Anda cari tidak tersedia"
  />
)
