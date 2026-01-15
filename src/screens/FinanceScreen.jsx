import React, { useState, useEffect } from 'react'
import { Home, Calendar, MessageSquare, Wallet, User, TrendingDown, TrendingUp, ArrowDownRight, ArrowUpRight, AlertCircle } from 'lucide-react'
import { getFinanceSummary, getTransactions, getMonthlyFinance } from '../services/firestoreService'

export default function FinanceScreen() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [financeSummary, setFinanceSummary] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [monthlyData, setMonthlyData] = useState(null)

  useEffect(() => {
    loadFinanceData()
  }, [])

  const loadFinanceData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load finance summary
      const summary = await getFinanceSummary()
      setFinanceSummary(summary || {
        balance: 2475000,
        monthIncome: 725000,
        monthExpenses: 550000,
      })

      // Load transactions
      const txns = await getTransactions(10)
      setTransactions(txns)

      // Load monthly data
      const now = new Date()
      const monthly = await getMonthlyFinance(now.getFullYear(), now.getMonth() + 1)
      setMonthlyData(monthly || {
        income: 725000,
        expenses: 550000,
        balance: 175000,
      })
    } catch (err) {
      console.error('Error loading finance data:', err)
      setError(err.message)
      // Fallback data
      setTransactions([
        { id: 1, type: 'in', description: 'Iuran Bulanan Anggota', amount: 450000, date: '15 Jan 2025' },
        { id: 2, type: 'in', description: 'Donasi Bakti Sosial', amount: 200000, date: '10 Jan 2025' },
        { id: 3, type: 'out', description: 'Pembelian Perlengkapan Olahraga', amount: 150000, date: '08 Jan 2025' },
        { id: 4, type: 'out', description: 'Hadiah Juara Turnamen', amount: 300000, date: '05 Jan 2025' },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center pb-20">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-accent rounded-full"></div>
        <p className="text-text-light mt-4">Memuat data keuangan...</p>
      </div>
    )
  }

  const balanceDisplay = financeSummary?.balance || 2475000
  const incomeDisplay = monthlyData?.income || financeSummary?.monthIncome || 725000
  const expenseDisplay = monthlyData?.expenses || financeSummary?.monthExpenses || 550000

  return (
    <div className="bg-background min-h-screen flex flex-col pb-20">
      {/* Status Bar */}
      <div className="bg-primary text-white px-4 py-2 text-xs flex justify-between">
        <span>09:41</span>
        <span>●●●●●●●●●●</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-b from-primary to-primary-light text-white px-4 pt-6 pb-8">
        <div className="flex items-center gap-3 mb-1">
          <img src="/logo.jpg" alt="KARTEJI" className="h-8 w-8 rounded-full object-cover ring-2 ring-white ring-opacity-30" />
          <h1 className="text-2xl font-bold">Keuangan</h1>
        </div>
        <p className="text-blue-100 text-sm ml-11">Transparansi Kas Karang Taruna</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {error && (
          <div className="bg-yellow-50 border border-warning border-opacity-30 rounded-lg p-3 mb-4 flex gap-2">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
            <p className="text-sm text-text-dark">Data dari Firebase tidak tersedia, menampilkan contoh data</p>
          </div>
        )}

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary to-primary-light text-white rounded-lg p-6 mb-6 shadow-lg">
          <p className="text-blue-100 text-sm mb-2">Saldo Kas Saat Ini</p>
          <h2 className="text-4xl font-bold mb-6">Rp {balanceDisplay.toLocaleString('id-ID')}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-20 rounded p-3">
              <p className="text-blue-100 text-xs mb-1">Pemasukan Bulan Ini</p>
              <p className="text-xl font-bold">Rp {incomeDisplay.toLocaleString('id-ID').substring(0, 10)}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded p-3">
              <p className="text-blue-100 text-xs mb-1">Pengeluaran Bulan Ini</p>
              <p className="text-xl font-bold">Rp {expenseDisplay.toLocaleString('id-ID').substring(0, 10)}</p>
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <p className="text-xs font-bold text-text-light uppercase tracking-wider mb-3">Ringkasan Bulanan</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-green-50 border border-success border-opacity-30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="text-xs text-text-light">Pemasukan</span>
            </div>
            <p className="text-lg font-bold text-success">Rp {incomeDisplay.toLocaleString('id-ID').substring(0, 10)}</p>
            <p className="text-xs text-text-light mt-1">↑ 12% dari bulan lalu</p>
          </div>
          <div className="bg-red-50 border border-danger border-opacity-30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-danger" />
              <span className="text-xs text-text-light">Pengeluaran</span>
            </div>
            <p className="text-lg font-bold text-danger">Rp {expenseDisplay.toLocaleString('id-ID').substring(0, 10)}</p>
            <p className="text-xs text-text-light mt-1">↓ 8% dari bulan lalu</p>
          </div>
        </div>

        {/* Transactions */}
        <p className="text-xs font-bold text-text-light uppercase tracking-wider mb-3">Transaksi Terakhir</p>
        <div className="space-y-2">
          {transactions.map((txn) => (
            <div key={txn.id} className="bg-white border border-border-light rounded-lg p-3 flex items-center justify-between hover:shadow-sm transition">
              {/* Left Content */}
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  txn.type === 'in' 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  {txn.type === 'in' ? (
                    <ArrowDownRight className="w-5 h-5 text-success" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-danger" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-dark truncate">{txn.description}</p>
                  <p className="text-xs text-text-light">{txn.date}</p>
                </div>
              </div>

              {/* Amount */}
              <p className={`text-sm font-bold whitespace-nowrap ml-2 ${
                txn.type === 'in' 
                  ? 'text-success' 
                  : 'text-danger'
              }`}>
                {txn.type === 'in' ? '+' : '-'} Rp {txn.amount.toLocaleString('id-ID')}
              </p>
            </div>
          ))}
        </div>

        {/* More Button */}
        <button className="w-full mt-4 border border-primary text-primary font-bold py-2 rounded-lg hover:bg-primary hover:text-white transition">
          Lihat Semua Transaksi
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light">
        <div className="flex justify-around items-center h-16 max-w-xs mx-auto">
          <button className="flex flex-col items-center justify-center flex-1 text-text-light hover:text-primary transition">
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Beranda</span>
          </button>
          <button className="flex flex-col items-center justify-center flex-1 text-text-light hover:text-primary transition">
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Kegiatan</span>
          </button>
          <button className="flex flex-col items-center justify-center flex-1 text-text-light hover:text-primary transition">
            <MessageSquare className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Diskusi</span>
          </button>
          <button className="flex flex-col items-center justify-center flex-1 text-primary">
            <Wallet className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Keuangan</span>
          </button>
          <button className="flex flex-col items-center justify-center flex-1 text-text-light hover:text-primary transition">
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Profil</span>
          </button>
        </div>
      </div>
    </div>
  )
}
