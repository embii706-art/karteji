import { ROLE_NAMES } from '../config/roles'

// Export to CSV
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n'
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header]
      // Handle special cases
      if (value === null || value === undefined) return ''
      if (typeof value === 'object') return JSON.stringify(value).replace(/,/g, ';')
      if (typeof value === 'string' && value.includes(',')) return `"${value}"`
      return value
    })
    csvContent += values.join(',') + '\n'
  })

  // Create download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Export Members to CSV
export const exportMembers = (members) => {
  const exportData = members.map(member => ({
    'ID Anggota': member.memberId,
    'Nama': member.name,
    'Email': member.email,
    'Telepon': member.phone || '-',
    'Role': ROLE_NAMES[member.role],
    'Status': member.status === 'active' ? 'Aktif' : 'Tidak Aktif',
    'Tanggal Bergabung': new Date(member.joinDate).toLocaleDateString('id-ID')
  }))
  
  exportToCSV(exportData, `anggota-${new Date().toISOString().split('T')[0]}`)
}

// Export Activities to CSV
export const exportActivities = (activities) => {
  const exportData = activities.map(activity => ({
    'Judul': activity.title,
    'Deskripsi': activity.description,
    'Tanggal': new Date(activity.date).toLocaleDateString('id-ID'),
    'Waktu': activity.time || '-',
    'Lokasi': activity.location || '-',
    'Status': activity.status,
    'Dibuat': new Date(activity.createdAt).toLocaleDateString('id-ID')
  }))
  
  exportToCSV(exportData, `kegiatan-${new Date().toISOString().split('T')[0]}`)
}

// Export Attendance to CSV
export const exportAttendance = (attendance, members, activityTitle) => {
  const exportData = attendance.map(att => {
    const member = members.find(m => m.id === att.memberId)
    return {
      'Nama': member?.name || 'Unknown',
      'ID Anggota': member?.memberId || '-',
      'Waktu Absen': new Date(att.timestamp).toLocaleString('id-ID'),
      'Status': 'Hadir'
    }
  })
  
  const filename = `absensi-${activityTitle.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`
  exportToCSV(exportData, filename)
}

// Export Finance to CSV
export const exportFinance = (transactions) => {
  const exportData = transactions.map(trans => ({
    'Tanggal': new Date(trans.date).toLocaleDateString('id-ID'),
    'Tipe': trans.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    'Jumlah': trans.amount,
    'Keterangan': trans.description,
    'Kategori': trans.category || '-'
  }))
  
  exportToCSV(exportData, `keuangan-${new Date().toISOString().split('T')[0]}`)
}

// Export Announcements to CSV
export const exportAnnouncements = (announcements) => {
  const exportData = announcements.map(ann => ({
    'Tanggal': new Date(ann.date).toLocaleDateString('id-ID'),
    'Judul': ann.title,
    'Isi': ann.content,
    'Prioritas': ann.priority,
    'Pembuat': ann.author || '-'
  }))
  
  exportToCSV(exportData, `pengumuman-${new Date().toISOString().split('T')[0]}`)
}

// Export Aspirations to CSV
export const exportAspirations = (aspirations) => {
  const exportData = aspirations.map(asp => ({
    'Tanggal': new Date(asp.createdAt).toLocaleDateString('id-ID'),
    'Judul': asp.title,
    'Deskripsi': asp.description,
    'Status': asp.status,
    'Pengusul': asp.submittedBy,
    'Jumlah Vote': asp.votes?.length || 0
  }))
  
  exportToCSV(exportData, `aspirasi-${new Date().toISOString().split('T')[0]}`)
}

// Print functionality
export const printPage = (title) => {
  const originalTitle = document.title
  document.title = title
  window.print()
  document.title = originalTitle
}

// Generate summary report
export const generateSummaryReport = (data) => {
  const {
    members,
    activities,
    finance,
    announcements,
    aspirations
  } = data

  const totalIncome = finance.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = finance.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)

  const summary = {
    'Tanggal Laporan': new Date().toLocaleDateString('id-ID'),
    'Total Anggota': members.length,
    'Anggota Aktif': members.filter(m => m.status === 'active').length,
    'Total Kegiatan': activities.length,
    'Kegiatan Selesai': activities.filter(a => a.status === 'completed').length,
    'Saldo': totalIncome - totalExpense,
    'Total Pemasukan': totalIncome,
    'Total Pengeluaran': totalExpense,
    'Total Pengumuman': announcements.length,
    'Total Aspirasi': aspirations.length,
    'Aspirasi Disetujui': aspirations.filter(a => a.status === 'approved').length
  }

  return summary
}

export const exportSummaryReport = (data) => {
  const summary = generateSummaryReport(data)
  const exportData = Object.entries(summary).map(([key, value]) => ({
    'Keterangan': key,
    'Nilai': value
  }))
  
  exportToCSV(exportData, `ringkasan-${new Date().toISOString().split('T')[0]}`)
}
