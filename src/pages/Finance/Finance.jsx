import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useApp } from '../../contexts/AppContext'
import { hasPermission } from '../../config/roles'
import { exportFinance } from '../../utils/export'

const Finance = () => {
  const { user } = useAuth()
  const { finance, addTransaction } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const [filter, setFilter] = useState('all')

  const canAdd = hasPermission(user?.role, 'ADD_TRANSACTION')
  const canView = hasPermission(user?.role, 'VIEW_FINANCE')

  if (!canView) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <p className="text-gray-600 dark:text-gray-400">Anda tidak memiliki akses ke halaman ini</p>
      </div>
    )
  }

  const filteredTransactions = finance.filter(t => {
    if (filter === 'all') return true
    return t.type === filter
  })

  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )

  const totalIncome = finance.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = finance.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Keuangan</h1>
        <div className="flex gap-2">
          <button
            onClick={() => exportFinance(finance)}
            className="btn btn-secondary"
            title="Export ke CSV"
          >
            📥 Export
          </button>
          {canAdd && (
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
              + Tambah Transaksi
            </button>
          )}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card text-center bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-sm opacity-90 mb-1">Saldo</div>
          <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
        </div>
        <div className="card text-center bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-sm opacity-90 mb-1">Pemasukan</div>
          <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
        </div>
        <div className="card text-center bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="text-sm opacity-90 mb-1">Pengeluaran</div>
          <div className="text-2xl font-bold">{formatCurrency(totalExpense)}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="card mb-6">
        <div className="flex gap-2">
          {['all', 'income', 'expense'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg ${
                filter === type
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              {type === 'all' && 'Semua'}
              {type === 'income' && '💰 Pemasukan'}
              {type === 'expense' && '💸 Pengeluaran'}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {sortedTransactions.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <p className="text-gray-600 dark:text-gray-400">Belum ada transaksi</p>
          </div>
        ) : (
          sortedTransactions.map(transaction => (
            <div key={transaction.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    transaction.type === 'income'
                      ? 'bg-green-100 dark:bg-green-900'
                      : 'bg-red-100 dark:bg-red-900'
                  }`}>
                    {transaction.type === 'income' ? '💰' : '💸'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{transaction.description}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                      {transaction.category && ` • ${transaction.category}`}
                    </p>
                  </div>
                </div>
                <div className={`text-lg font-bold ${
                  transaction.type === 'income'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <AddTransactionModal
          onClose={() => setShowAddModal(false)}
          onAdd={addTransaction}
        />
      )}
    </div>
  )
}

const AddTransactionModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newTransaction = {
        ...formData,
        amount: parseFloat(formData.amount),
        id: `transaction_${Date.now()}`,
        createdAt: new Date().toISOString()
      }
      
      await onAdd(newTransaction)
      alert('Transaksi berhasil ditambahkan!')
      onClose()
    } catch (error) {
      alert('Gagal menambahkan transaksi: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Tambah Transaksi</h2>
          <button onClick={onClose} className="text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipe *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="input"
            >
              <option value="income">💰 Pemasukan</option>
              <option value="expense">💸 Pengeluaran</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Jumlah (Rp) *</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="input"
              min="0"
              step="1000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Keterangan *</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="input"
              placeholder="Misal: Iuran, Acara, Operasional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tanggal *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="input"
              required
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
              {loading ? 'Menambahkan...' : 'Tambah Transaksi'}
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

export default Finance
