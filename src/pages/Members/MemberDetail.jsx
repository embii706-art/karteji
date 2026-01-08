import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useApp } from '../../contexts/AppContext'
import { ROLE_NAMES, hasPermission, canManageRole } from '../../config/roles'
import { generateMemberQR } from '../../utils/attendance'
import QRCode from 'qrcode'

const MemberDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { members, updateMember, activities } = useApp()
  const [member, setMember] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [qrImage, setQrImage] = useState('')
  const [loading, setLoading] = useState(false)

  const canEdit = hasPermission(user?.role, 'EDIT_MEMBER_ROLES')
  const canManage = canEdit && member && canManageRole(user?.role, member.role)

  useEffect(() => {
    const foundMember = members.find(m => m.id === id)
    if (foundMember) {
      setMember(foundMember)
      setFormData(foundMember)
      generateQR(foundMember)
    } else {
      navigate('/members')
    }
  }, [id, members, navigate])

  const generateQR = async (memberData) => {
    try {
      const qrData = generateMemberQR(memberData.id, memberData.name)
      const qrCodeUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2
      })
      setQrImage(qrCodeUrl)
    } catch (error) {
      console.error('Failed to generate QR:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateMember(formData)
      setMember(formData)
      setIsEditing(false)
      alert('Data anggota berhasil diperbarui!')
    } catch (error) {
      alert('Gagal memperbarui data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getMemberActivities = () => {
    return activities.filter(activity => {
      const attendance = activity.attendance || []
      return attendance.some(a => a.memberId === member?.id)
    })
  }

  if (!member) {
    return (
      <div className="animate-fade-in">
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      </div>
    )
  }

  const memberActivities = getMemberActivities()
  const attendanceRate = activities.length > 0 
    ? Math.round((memberActivities.length / activities.length) * 100)
    : 0

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/members')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Detail Anggota</h1>
      </div>

      {/* Profile Card */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
              {member.photo ? (
                <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                member.name.charAt(0).toUpperCase()
              )}
            </div>
            {qrImage && (
              <div className="bg-white p-2 rounded-lg">
                <img src={qrImage} alt="QR Code" className="w-32 h-32" />
                <p className="text-xs text-center text-gray-600 mt-1">QR Member</p>
              </div>
            )}
          </div>

          <div className="flex-1">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">No. Telepon</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="input"
                  />
                </div>

                {canManage && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Role</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        className="input"
                      >
                        {Object.entries(ROLE_NAMES)
                          .filter(([key]) => canManageRole(user?.role, key))
                          .map(([key, name]) => (
                            <option key={key} value={key}>{name}</option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="input"
                      >
                        <option value="active">Aktif</option>
                        <option value="inactive">Tidak Aktif</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="flex gap-2">
                  <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setFormData(member)
                    }}
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    Batal
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{member.name}</h2>
                    <p className="text-primary font-medium">{ROLE_NAMES[member.role]}</p>
                  </div>
                  {canManage && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-secondary"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <span className="text-lg">🆔</span>
                    <span>{member.memberId}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <span className="text-lg">📧</span>
                    <span>{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <span className="text-lg">📱</span>
                      <span>{member.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <span className="text-lg">📅</span>
                    <span>
                      Bergabung {new Date(member.joinDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📊</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      member.status === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {member.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary">{memberActivities.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Kegiatan Diikuti</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">{attendanceRate}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Tingkat Kehadiran</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600">
            {member.joinDate ? new Date().getFullYear() - new Date(member.joinDate).getFullYear() : 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Tahun Bergabung</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600">
            {ROLE_NAMES[member.role]}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Jabatan</div>
        </div>
      </div>

      {/* Activity History */}
      <div className="card">
        <h3 className="font-bold text-lg mb-4">Riwayat Kegiatan</h3>
        {memberActivities.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 py-8">
            Belum mengikuti kegiatan apapun
          </p>
        ) : (
          <div className="space-y-2">
            {memberActivities.slice(0, 10).map(activity => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <div className="font-medium">{activity.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(activity.date).toLocaleDateString('id-ID')}
                  </div>
                </div>
                <span className="text-green-600">✓</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MemberDetail
