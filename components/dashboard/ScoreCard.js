'use client'

import { useState } from 'react'

export default function ScoreCard({ initialScores = [] }) {
  const [scores, setScores] = useState(initialScores)
  const [newScore, setNewScore] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: parsed, date }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess('Score added successfully')
        setNewScore('')
        const updated = await fetch('/api/scores')
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
    <div className="border border-[#1a4a2e] p-6">
      <p className="text-[#c9a84c] text-xs tracking-[3px] uppercase mb-1">Stableford</p>
      <h2 className="font-playfair text-2xl mb-6">My Scores</h2>

      {/* Input Row */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="number"
          placeholder="Score (1–45)"
          className="bg-[#0f2d1a] border border-[#1a4a2e] text-[#f0ece0] px-4 py-3
                     outline-none focus:border-[#c9a84c] transition-colors flex-1
                     min-w-[120px] placeholder:text-[#2a3a2e]"
          value={newScore}
          min={1}
          max={45}
          onChange={(e) => setNewScore(e.target.value)}
        />
        <input
          type="date"
          className="bg-[#0f2d1a] border border-[#1a4a2e] text-[#f0ece0] px-4 py-3
                     outline-none focus:border-[#c9a84c] transition-colors flex-1
                     min-w-[140px]"
          value={date}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          onClick={addScore}
          disabled={loading}
          className="bg-[#c9a84c] text-[#0a0f0a] px-6 py-3 font-bold tracking-widest
                     uppercase text-sm hover:bg-[#b8943d] transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>

      {error && (
        <div className="border border-red-900 bg-red-900/20 px-4 py-2
                        text-red-400 text-sm mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="border border-emerald-900 bg-emerald-900/20 px-4 py-2
                        text-emerald-400 text-sm mb-4">
          {success}
        </div>
      )}

      <p className="text-xs text-[#4a5a4e] uppercase tracking-wider mb-3">
        Last 5 scores · oldest auto-removed
      </p>

      {scores.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-[#1a4a2e]">
          <p className="text-[#4a5a4e] font-playfair text-lg">No scores yet</p>
          <p className="text-xs text-[#2a3a2e] mt-1">Add your first round above</p>
        </div>
      ) : (
        <div className="space-y-2">
          {scores.map((s, i) => (
            <div key={s.id}
              className="flex justify-between items-center border border-[#1a4a2e]
                         px-4 py-3 hover:bg-[#0f2d1a] transition-colors">
              <div className="flex items-center gap-4">
                {i === 0 && (
                  <span className="text-xs bg-[#c9a84c]/20 text-[#c9a84c] px-2 py-0.5
                                   font-bold uppercase tracking-wider">
                    Latest
                  </span>
                )}
                <span className="font-playfair text-3xl text-[#f0ece0]">{s.score}</span>
              </div>
              <span className="text-[#4a5a4e] text-sm">
                {new Date(s.date).toLocaleDateString('en-GB')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}