'use client'

import { useState } from 'react'

export default function ScoreCard({ initialScores = [] }) {
  const [scores,   setScores]   = useState(initialScores)
  const [newScore, setNewScore] = useState('')
  const [date,     setDate]     = useState(new Date().toISOString().split('T')[0])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')

  const addScore = async () => {
    setError('')
    setSuccess('')

    const parsed = parseInt(newScore)
    if (!parsed || parsed < 1 || parsed > 45) {
      setError('Score must be between 1 and 45')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/scores/add', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ score: parsed, date }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess('Score added!')
        setNewScore('')
        const updated     = await fetch('/api/scores')
        const updatedData = await updated.json()
        if (updatedData.scores) setScores(updatedData.scores)
      } else {
        setError(data.error || 'Failed to add score')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Input Row */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="number"
          placeholder="Score (1–45)"
          value={newScore}
          min={1}
          max={45}
          onChange={(e) => setNewScore(e.target.value)}
          className="bg-[#f2f4f3] border-none rounded-[1rem] px-4 py-3
                     outline-none focus:ring-2 focus:ring-[#006d37]
                     text-sm text-[#191c1c] placeholder:text-[#72796f]
                     flex-1 min-w-[120px]"
        />
        <input
          type="date"
          value={date}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => setDate(e.target.value)}
          className="bg-[#f2f4f3] border-none rounded-[1rem] px-4 py-3
                     outline-none focus:ring-2 focus:ring-[#006d37]
                     text-sm text-[#191c1c] flex-1 min-w-[140px]"
        />
        <button
          onClick={addScore}
          disabled={loading}
          className="text-white px-6 py-3 rounded-full font-bold text-sm
                     hover:scale-105 transition-all disabled:opacity-50
                     disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{background:'linear-gradient(135deg,#002e0b,#0b4619)'}}>
          {loading ? 'Adding...' : 'Add Score'}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2
                        rounded-[1rem] text-sm mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-[#9bf6b2]/30 border border-[#006d37]/30 text-[#006d37]
                        px-4 py-2 rounded-[1rem] text-sm mb-4">
          {success}
        </div>
      )}

      {/* Scores List */}
      <p className="text-xs text-[#424940] uppercase tracking-wider font-bold mb-3">
        Last 5 scores · oldest auto-removed
      </p>

      {scores.length === 0 ? (
        <div className="text-center py-8 bg-[#f2f4f3] rounded-[1.5rem]">
          <span className="material-symbols-outlined text-3xl text-[#c1c9bd]
                           block mb-2">
            sports_golf
          </span>
          <p className="text-[#424940] text-sm">
            No scores yet — add your first round!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {scores.map((s, i) => (
            <div key={s.id}
              className="flex justify-between items-center bg-[#f2f4f3]
                         px-4 py-3 rounded-[1rem] hover:bg-[#eceeed]
                         transition-colors">
              <div className="flex items-center gap-3">
                {i === 0 && (
                  <span className="bg-[#9bf6b2] text-[#00210c] text-[10px]
                                   font-black uppercase tracking-widest px-2
                                   py-0.5 rounded-full">
                    Latest
                  </span>
                )}
                <span className="font-headline font-extrabold text-2xl
                                 text-[#002e0b]">
                  {s.score}
                </span>
              </div>
              <span className="text-[#424940] text-sm">
                {new Date(s.date).toLocaleDateString('en-GB')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}