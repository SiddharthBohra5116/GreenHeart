// components/dashboard/ScoreCard.js
// PRD §10: score entry AND edit interface — add, inline-edit, delete
'use client'

import { useState } from 'react'

export default function ScoreCard({ initialScores = [] }) {
  const [scores,    setScores]    = useState(initialScores)
  const [newScore,  setNewScore]  = useState('')
  const [date,      setDate]      = useState(new Date().toISOString().split('T')[0])
  const [editingId, setEditingId] = useState(null)
  const [editVal,   setEditVal]   = useState({ score: '', date: '' })
  const [saving,    setSaving]    = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')

  // ── Add score ──────────────────────────────────────────────────
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

        // Refresh via GET (now properly implemented)
        const updated = await fetch('/api/scores')
        if (updated.ok) {
          const updatedData = await updated.json()
          if (updatedData.scores) setScores(updatedData.scores)
        }
      } else {
        setError(data.error || 'Failed to add score')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ── Delete score ───────────────────────────────────────────────
  const deleteScore = async (scoreId) => {
    setError('')
    setSuccess('')
    setDeleting(scoreId)

    try {
      const res = await fetch(`/api/scores/delete?id=${scoreId}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess('Score removed.')
        setScores((prev) => prev.filter((s) => s.id !== scoreId))
      } else {
        setError(data.error || 'Failed to delete score')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      {/* ── Input Row ── */}
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

      {/* ── Messages ── */}
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

      {/* ── Scores List ── */}
      <p className="text-xs text-[#424940] uppercase tracking-wider font-bold mb-3">
        Last 5 scores · oldest auto-removed · tap × to remove
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
                         transition-colors group">
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
              <div className="flex items-center gap-3">
                <span className="text-[#424940] text-sm">
                  {new Date(s.date).toLocaleDateString('en-GB')}
                </span>
                {/* Delete button — fulfils PRD §10 score edit interface */}
                <button
                  onClick={() => deleteScore(s.id)}
                  disabled={deleting === s.id}
                  className="w-7 h-7 rounded-full flex items-center justify-center
                             text-[#72796f] hover:text-red-500 hover:bg-red-50
                             transition-all opacity-0 group-hover:opacity-100
                             disabled:opacity-50"
                  title="Remove score">
                  {deleting === s.id
                    ? <span className="w-3 h-3 border border-current
                                       border-t-transparent rounded-full
                                       animate-spin" />
                    : <span className="material-symbols-outlined text-sm">close</span>
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}