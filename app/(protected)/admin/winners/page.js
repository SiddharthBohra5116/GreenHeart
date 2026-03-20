'use client'

import { useState, useEffect } from 'react'

export default function AdminWinners() {
  const [winners, setWinners] = useState([])
  const [tab, setTab] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const fetchWinners = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/winners')
    const data = await res.json()
    setWinners(data.winners || [])
    setLoading(false)
  }

  useEffect(() => { fetchWinners() }, [])

  const handleAction = async (id, action) => {
    setMessage('')
    const res = await fetch('/api/admin/winners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    })
    const data = await res.json()
    if (res.ok) {
      setMessage(data.message)
      fetchWinners()
    }
  }

  const pending = winners.filter(w => w.status === 'pending_verification')
  const displayed = tab === 'pending' ? pending : winners

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-5xl font-extrabold font-headline text-primary mb-2">
          Winner Verification
        </h1>
        <p className="text-on-surface-variant max-w-2xl font-medium">
          Review and validate winners before releasing payouts.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className="glass-panel px-6 py-4 text-sm text-secondary font-semibold">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-8 border-b border-outline-variant/20">
        {[
          { key: 'pending', label: `Pending (${pending.length})` },
          { key: 'all', label: `All Winners (${winners.length})` },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-4 text-sm font-bold transition-all ${
              tab === t.key
                ? 'border-b-2 border-secondary text-secondary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16 text-on-surface-variant">
          Loading winners...
        </div>
      )}

      {/* Empty */}
      {!loading && displayed.length === 0 && (
        <div className="text-center py-20 glass-panel rounded-lg">
          <p className="text-2xl font-headline text-on-surface-variant">
            {tab === 'pending'
              ? 'No pending verifications'
              : 'No winners yet'}
          </p>
        </div>
      )}

      {/* Cards */}
      <div className="space-y-6">
        {displayed.map(w => (
          <div key={w.id}
            className="glass-panel p-8 rounded-lg shadow-sm hover:shadow-md transition-all">

            {/* Top */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">

              {/* User */}
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full soulful-gradient flex items-center justify-center text-white font-bold">
                  {(w.users?.name || 'U')
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-on-surface">
                    {w.users?.name || 'Unknown'}
                  </h3>
                  <p className="text-on-surface-variant text-sm">
                    {w.users?.email}
                  </p>
                </div>
              </div>

              {/* Status */}
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                w.status === 'paid'
                  ? 'bg-secondary text-white'
                  : w.status === 'approved'
                  ? 'bg-blue-500 text-white'
                  : w.status === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-yellow-400 text-black'
              }`}>
                {w.status}
              </span>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 p-5 rounded-lg bg-surface-container-low mb-6">

              <div>
                <p className="text-xs text-on-surface-variant uppercase mb-1">
                  Match Type
                </p>
                <p className="font-bold text-primary">
                  {w.match_count}-Match
                </p>
              </div>

              <div>
                <p className="text-xs text-on-surface-variant uppercase mb-1">
                  Prize
                </p>
                <p className="text-3xl font-headline font-extrabold text-secondary">
                  ₹{w.prize_amount?.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-on-surface-variant uppercase mb-1">
                  Numbers
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {w.matched_numbers?.map(n => (
                    <span key={n}
                      className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Proof */}
            {w.proof_url && (
              <div className="flex items-center gap-2 text-secondary font-medium mb-4">
                <span className="material-symbols-outlined text-sm">
                  description
                </span>
                <a href={w.proof_url} target="_blank"
                  className="underline hover:text-primary">
                  View Proof
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 border-t pt-5">

              {w.status === 'pending_verification' && (
                <>
                  <button
                    onClick={() => handleAction(w.id, 'reject')}
                    className="px-6 py-2 border-2 border-red-500 text-red-500 rounded-full text-sm font-bold hover:bg-red-50">
                    Reject
                  </button>

                  <button
                    onClick={() => handleAction(w.id, 'approve')}
                    className="px-6 py-2 rounded-full soulful-gradient text-white text-sm font-bold shadow-md hover:scale-105 transition">
                    Approve
                  </button>
                </>
              )}

              {w.status === 'approved' && (
                <button
                  onClick={() => handleAction(w.id, 'paid')}
                  className="px-6 py-2 rounded-full bg-secondary text-white font-bold text-sm">
                  Mark as Paid
                </button>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}