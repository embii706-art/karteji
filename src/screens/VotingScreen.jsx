import React, { useState } from 'react'
import { Home, Calendar, MessageSquare, Wallet, User, Clock, TrendingUp } from 'lucide-react'

export default function VotingScreen() {
  const [voted, setVoted] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)

  const voting = {
    title: 'Pemilihan Ketua Karang Taruna Periode 2025-2027',
    description: 'Silakan pilih calon ketua Karang Taruna yang Anda dukung untuk periode 2025-2027',
    endTime: '17 Januari 2025, 20:00',
    totalVoters: 45,
    candidates: [
      {
        id: 1,
        name: 'Andi Wijaya',
        background: 'Pelatih Olahraga',
        votes: 18,
        image: 'AW',
        bgColor: 'bg-blue-200',
      },
      {
        id: 2,
        name: 'Siti Nurhaliza',
        background: 'Pengelola Keuangan',
        votes: 15,
        image: 'SN',
        bgColor: 'bg-purple-200',
      },
      {
        id: 3,
        name: 'Budi Santoso',
        background: 'Koordinator Program',
        votes: 12,
        image: 'BS',
        bgColor: 'bg-green-200',
      },
    ],
  }

  const handleVote = () => {
    if (selectedOption !== null) {
      setVoted(true)
    }
  }

  return (
    <div className="bg-background min-h-screen flex flex-col pb-20">
      {/* Status Bar */}
      <div className="bg-primary text-white px-4 py-2 text-xs flex justify-between">
        <span>09:41</span>
        <span>●●●●●●●●●●</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-b from-primary to-primary-light text-white px-4 pt-6 pb-8">
        <h1 className="text-2xl font-bold mb-1">Musyawarah Digital</h1>
        <p className="text-blue-100 text-sm">Pengambilan keputusan bersama</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Voting Header */}
        <div className="bg-white border border-border-light rounded-lg p-4 mb-6 shadow-sm">
          <h2 className="font-bold text-sm text-text-dark mb-2">{voting.title}</h2>
          <p className="text-xs text-text-light mb-4">{voting.description}</p>

          {/* Countdown */}
          <div className="flex items-center gap-2 bg-yellow-50 border border-accent border-opacity-30 rounded p-3 mb-4">
            <Clock className="w-4 h-4 text-accent-dark flex-shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-accent-dark">Ditutup: {voting.endTime}</p>
              <p className="text-text-light">Total pemilih: {voting.totalVoters}</p>
            </div>
          </div>
        </div>

        {!voted ? (
          <>
            {/* Candidates */}
            <p className="text-xs font-bold text-text-light uppercase tracking-wider mb-3">Pilih Calon Ketua</p>
            <div className="space-y-3 mb-6">
              {voting.candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  onClick={() => setSelectedOption(candidate.id)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                    selectedOption === candidate.id
                      ? 'border-primary bg-blue-50'
                      : 'border-border-light hover:border-primary hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Candidate Avatar */}
                    <div className={`${candidate.bgColor} w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-text-dark flex-shrink-0`}>
                      {candidate.image}
                    </div>

                    {/* Candidate Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-text-dark">{candidate.name}</h3>
                      <p className="text-xs text-text-light mb-2">{candidate.background}</p>

                      {/* Vote Progress */}
                      <div className="w-full bg-border-light rounded-full h-1.5 mb-1">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${(candidate.votes / voting.totalVoters) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-text-light">{candidate.votes} suara</p>
                    </div>

                    {/* Radio Button */}
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      selectedOption === candidate.id
                        ? 'border-primary bg-primary'
                        : 'border-text-light'
                    }`}>
                      {selectedOption === candidate.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Vote Button */}
            <button
              onClick={handleVote}
              disabled={selectedOption === null}
              className={`w-full font-bold py-3 rounded-lg transition ${
                selectedOption === null
                  ? 'bg-border-light text-text-light cursor-not-allowed'
                  : 'bg-success text-white hover:opacity-90'
              }`}
            >
              Kirim Suara
            </button>
          </>
        ) : (
          /* Voted Confirmation */
          <div className="bg-green-50 border border-success rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-success text-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              ✓
            </div>
            <h3 className="font-bold text-lg text-success mb-2">Terima Kasih!</h3>
            <p className="text-sm text-text-light mb-6">
              Suara Anda untuk <strong>{voting.candidates.find(c => c.id === selectedOption)?.name}</strong> telah dicatat dengan aman.
            </p>
            <p className="text-xs text-text-light mb-4">
              Hasil voting akan diumumkan setelah masa pemilihan berakhir.
            </p>
            <button
              onClick={() => setVoted(false)}
              className="text-xs font-bold text-success hover:underline"
            >
              Kembali ke Kandidat
            </button>
          </div>
        )}

        {/* Voting Result Preview */}
        <div className="mt-8 bg-white border border-border-light rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-text-dark">Hasil Saat Ini</h3>
          </div>
          <p className="text-xs text-text-light mb-3">Total suara: {voting.totalVoters}</p>
          <div className="space-y-3">
            {voting.candidates.map((candidate) => (
              <div key={candidate.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-text-dark">{candidate.name}</span>
                  <span className="text-xs font-bold text-primary">{((candidate.votes / voting.totalVoters) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-border-light rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(candidate.votes / voting.totalVoters) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
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
          <button className="flex flex-col items-center justify-center flex-1 text-primary">
            <MessageSquare className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Diskusi</span>
          </button>
          <button className="flex flex-col items-center justify-center flex-1 text-text-light hover:text-primary transition">
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
