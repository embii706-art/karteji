import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useApp } from '../../contexts/AppContext'
import { hasPermission } from '../../config/roles'

const Aspirations = () => {
  const { user } = useAuth()
  const { aspirations, addAspiration, updateAspiration } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const [filter, setFilter] = useState('all')

  const canCreate = hasPermission(user?.role, 'CREATE_ASPIRATION')
  const canManage = hasPermission(user?.role, 'MANAGE_ASPIRATION')
  const canVote = hasPermission(user?.role, 'VOTE_ASPIRATION')

  const filteredAspirations = aspirations.filter(asp => {
    if (filter === 'all') return true
    return asp.status === filter
  })

  const sortedAspirations = [...filteredAspirations].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  )

  const handleVote = async (aspiration) => {
    if (!canVote) return
    
    const hasVoted = aspiration.votes?.includes(user?.id)
    const updatedVotes = hasVoted
      ? aspiration.votes.filter(id => id !== user?.id)
      : [...(aspiration.votes || []), user?.id]

    try {
      await updateAspiration({
        ...aspiration,
        votes: updatedVotes
      })
    } catch (error) {
      alert('Gagal melakukan voting: ' + error.message)
    }
  }

  const handleStatusChange = async (aspiration, newStatus) => {
    if (!canManage) return

    try {
      await updateAspiration({
        ...aspiration,
        status: newStatus
      })
      alert('Status berhasil diubah!')
    } catch (error) {
      alert('Gagal mengubah status: ' + error.message)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Aspirasi</h1>
        {canCreate && (
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            + Kirim Aspirasi
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="card mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'pending', 'reviewed', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              {status === 'all' && 'Semua'}
              {status === 'pending' && '🕒 Menunggu'}
              {status === 'reviewed' && '👀 Ditinjau'}
              {status === 'approved' && '✅ Disetujui'}
              {status === 'rejected' && '❌ Ditolak'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary">{aspirations.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-yellow-600">
            {aspirations.filter(a => a.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Menunggu</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">
            {aspirations.filter(a => a.status === 'approved').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Disetujui</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600">
            {aspirations.filter(a => a.status === 'reviewed').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Ditinjau</div>
        </div>
      </div>

      {/* Aspirations List */}
      <div className="space-y-4">
        {sortedAspirations.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-600 dark:text-gray-400">Belum ada aspirasi</p>
          </div>
        ) : (
          sortedAspirations.map(aspiration => (
            <div key={aspiration.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{aspiration.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {aspiration.submittedBy} • {new Date(aspiration.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                  aspiration.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                  aspiration.status === 'reviewed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                  aspiration.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                  'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {aspiration.status === 'pending' && 'Menunggu'}
                  {aspiration.status === 'reviewed' && 'Ditinjau'}
                  {aspiration.status === 'approved' && 'Disetujui'}
                  {aspiration.status === 'rejected' && 'Ditolak'}
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-3">{aspiration.description}</p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleVote(aspiration)}
                  disabled={!canVote}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                    aspiration.votes?.includes(user?.id)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  } ${!canVote ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span>👍</span>
                  <span className="font-medium">{aspiration.votes?.length || 0}</span>
                </button>

                {canManage && (
                  <div className="flex gap-2">
                    {aspiration.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(aspiration, 'reviewed')}
                        className="btn btn-secondary text-sm"
                      >
                        Tinjau
                      </button>
                    )}
                    {aspiration.status === 'reviewed' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(aspiration, 'approved')}
                          className="btn btn-primary text-sm"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() => handleStatusChange(aspiration, 'rejected')}
                          className="btn btn-secondary text-sm"
                        >
                          Tolak
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <AddAspirationModal
          onClose={() => setShowAddModal(false)}
          onAdd={addAspiration}
          userName={user?.name}
        />
      )}
    </div>
  )
}

const AddAspirationModal = ({ onClose, onAdd, userName }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newAspiration = {
        ...formData,
        id: `aspiration_${Date.now()}`,
        submittedBy: userName,
        status: 'pending',
        votes: [],
        createdAt: new Date().toISOString()
      }
      
      await onAdd(newAspiration)
      alert('Aspirasi berhasil dikirim!')
      onClose()
    } catch (error) {
      alert('Gagal mengirim aspirasi: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Kirim Aspirasi</h2>
          <button onClick={onClose} className="text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Judul *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="input"
              rows={5}
              required
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Aspirasi'}
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

export default Aspirations
