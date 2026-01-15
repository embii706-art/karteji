import React, { useState, useEffect } from 'react'
import { Clock, TrendingUp, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getActiveVoting, submitVote, getVotingResults } from '../services/firestoreService'
import { getProfilePhotoUrl } from '../lib/cloudinary'

export default function VotingScreen() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [voting, setVoting] = useState(null)
  const [voted, setVoted] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)

  useEffect(() => {
    loadVotingData()
  }, [])

  const loadVotingData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get active voting from Firebase
      const activeVoting = await getActiveVoting()
      if (!activeVoting) {
        throw new Error('Tidak ada voting aktif saat ini')
      }
      setVoting(activeVoting)

      // Check if user already voted
      const hasVoted = activeVoting.voters?.includes(user.id)
      setVoted(hasVoted)
    } catch (err) {
      console.error('Error loading voting data:', err)
      setError(err.message)
      setVoting(null)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async () => {
    if (selectedOption === null || !user) return

    try {
      await submitVote(voting.id, selectedOption, user.id)
      setVoted(true)
      loadVotingData()
    } catch (err) {
      alert('Gagal submit vote: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center pb-20">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-accent rounded-full"></div>
        <p className="text-text-light mt-4">Memuat data voting...</p>
      </div>
    )
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
        <div className="flex items-center gap-3 mb-1">
          <img src="/logo.jpg" alt="KARTEJI" className="h-8 w-8 rounded-full object-cover ring-2 ring-white ring-opacity-30" />
          <h1 className="text-2xl font-bold">Musyawarah Digital</h1>
        </div>
        <p className="text-blue-100 text-sm ml-11">Pengambilan keputusan bersama</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {error && (
          <div className="bg-red-50 border border-danger border-opacity-30 rounded-lg p-4 mb-4 flex gap-2">
            <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-danger">Error</p>
              <p className="text-sm text-text-dark">{error}</p>
            </div>
          </div>
        )}

        {!voting && !error && (
          <div className="text-center py-12">
            <p className="text-text-light">Tidak ada voting aktif saat ini</p>
          </div>
        )}

        {voting && (
          <>
            {/* Voting Header */}
            <div className="bg-white border border-border-light rounded-lg p-4 mb-6 shadow-sm">
              <h2 className="font-bold text-sm text-text-dark mb-2">{voting.title}</h2>
              <p className="text-xs text-text-light mb-4">{voting.description}</p>

              {/* Countdown */}
              <div className="flex items-center gap-2 bg-yellow-50 border border-accent border-opacity-30 rounded p-3 mb-4">
                <Clock className="w-4 h-4 text-accent-dark flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-accent-dark">Ditutup: {voting.endTime}</p>
                  <p className="text-text-light">Total pemilih: {voting.totalVoters || 0}</p>
                </div>
              </div>
            </div>

            {!voted ? (
              <>
                {/* Candidates */}
                <p className="text-xs font-bold text-text-light uppercase tracking-wider mb-3">Pilih Calon</p>
                <div className="space-y-3 mb-6">
                  {voting.candidates?.map((candidate) => {
                    const photoUrl = candidate.photoUrl ? getProfilePhotoUrl(candidate.photoUrl) : null
                    return (
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
                          {photoUrl ? (
                            <img src={photoUrl} alt={candidate.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className="bg-blue-200 w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-text-dark flex-shrink-0">
                              {candidate.name?.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}

                    {/* Candidate Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-text-dark">{candidate.name}</h3>
                      <p className="text-xs text-text-light mb-2">{candidate.background || 'Kandidat'}</p>

                      {/* Vote Progress */}
                      <div className="w-full bg-border-light rounded-full h-1.5 mb-1">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${voting.totalVoters > 0 ? (candidate.votes / voting.totalVoters) * 100 : 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-text-light">{candidate.votes || 0} suara</p>
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
                    )
                  })}
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
                  Suara Anda telah dicatat dengan aman.
                </p>
                <p className="text-xs text-text-light">
                  Hasil voting akan diumumkan setelah masa pemilihan berakhir.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
