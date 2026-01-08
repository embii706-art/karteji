import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useApp } from '../../contexts/AppContext'
import { ROLE_NAMES, hasPermission, canManageRole } from '../../config/roles'
import { exportMembers } from '../../utils/export'

const Members = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { members, addMember, updateMember } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const canAdd = hasPermission(user?.role, 'ADD_MEMBERS')
  const canEdit = hasPermission(user?.role, 'EDIT_MEMBER_ROLES')

  // Filter members
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.memberId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || member.role === filterRole
    return matchesSearch && matchesRole
  })

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Daftar Anggota</h1>
        <div className="flex gap-2">
          <button
            onClick={() => exportMembers(members)}
            className="btn btn-secondary"
            title="Export ke CSV"
          >
            📥 Export
          </button>
          {canAdd && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              + Tambah Anggota
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari nama atau ID anggota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="input sm:w-48"
          >
            <option value="all">Semua Role</option>
            {Object.entries(ROLE_NAMES).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary">{members.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Anggota</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">
            {members.filter(m => m.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Aktif</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-yellow-600">
            {members.filter(m => m.status === 'inactive').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Tidak Aktif</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600">
            {filteredMembers.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Hasil Filter</div>
        </div>
      </div>

      {/* Members List */}
      <div className="space-y-3">
        {filteredMembers.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterRole !== 'all' ? 'Tidak ada anggota yang sesuai' : 'Belum ada anggota'}
            </p>
          </div>
        ) : (
          filteredMembers.map(member => (
            <div
              key={member.id}
              onClick={() => navigate(`/members/${member.id}`)}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold overflow-hidden">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    member.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{member.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span>{ROLE_NAMES[member.role]}</span>
                    <span>•</span>
                    <span>{member.memberId}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    member.status === 'active'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {member.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <AddMemberModal
          onClose={() => setShowAddModal(false)}
          onAdd={addMember}
          canManage={canManageRole}
          userRole={user?.role}
        />
      )}
    </div>
  )
}

const AddMemberModal = ({ onClose, onAdd, canManage, userRole }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'anggota',
    status: 'active'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newMember = {
        ...formData,
        id: `member_${Date.now()}`,
        memberId: `KT${Date.now().toString().slice(-6)}`,
        joinDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
      
      await onAdd(newMember)
      alert('Anggota berhasil ditambahkan!')
      onClose()
    } catch (error) {
      alert('Gagal menambahkan anggota: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Tambah Anggota Baru</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Lengkap *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
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
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="input"
              required
            >
              {Object.entries(ROLE_NAMES)
                .filter(([key]) => canManage(userRole, key))
                .map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
              {loading ? 'Menambahkan...' : 'Tambah Anggota'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Members
