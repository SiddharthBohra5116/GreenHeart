'use client'

import { useState, useEffect } from 'react'

export default function AdminWinners() {
  const [winners, setWinners] = useState([])
  const [tab,     setTab]     = useState('pending')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ text: '', ok: true })

  const fetchWinners = async () => {
    setLoading(true)
    const res  = await fetch('/api/admin/winners')
    const data = await res.json()
    setWinners(data.winners || [])
    setLoading(false)
  }

  useEffect(() => { fetchWinners() }, [])

  const handleAction = async (id, action) => {
    setMessage({ text: '', ok: true })
    const res  = await fetch('/api/admin/winners', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id, action }),
    })
    const data = await res.json()
    if (res.ok) {
      setMessage({ text: data.message || 'Updated successfully', ok: true })
      fetchWinners()
    } else {
      setMessage({ text: data.error || 'Action failed', ok: false })
    }
  }

  const pending   = winners.filter(w => w.status === 'pending_verification')
  const displayed = tab === 'pending' ? pending : winners

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-5xl font-extrabold font-headline text-[#002e0b] mb-2">
          Winner Verification
        </h1>
        <p className="text-[#424940] max-w-2xl font-medium">
          Review and validate winners before releasing payouts.
        </p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`px-6 py-4 rounded-[1rem] text-sm font-semibold ${
          message.ok
            ? 'bg-[#9bf6b2] text-emerald-900'
            : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-8 border-b border-[#c1c9bd]/20">
        {[
          { key: 'pending', label: `Pending (${pending.length})` },
          { key: 'all',     label: `All Winners (${winners.length})` },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-4 text-sm font-bold transition-all ${
              tab === t.key
                ? 'border-b-2 border-[#006d37] text-[#006d37]'
                : 'text-[#424940] hover:text-[#002e0b]'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16 text-[#424940]">
          Loading winners...
        </div>
      )}

      {/* Empty */}
      {!loading && displayed.length === 0 && (
        <div className="text-center py-20 glass-panel rounded-[2rem]">
          <span className="material-symbols-outlined text-5xl text-[#c1c9bd] block mb-3">
            emoji_events
          </span>
          <p className="text-xl font-headline text-[#424940]">
            {tab === 'pending' ? 'No pending verifications' : 'No winners yet'}
          </p>
        </div>
      )}

      {/* Winner Cards */}
      <div className="space-y-6">
        {displayed.map(w => (
          <div key={w.id}
            className="glass-panel p-8 rounded-[2rem] shadow-sm
                       hover:shadow-md transition-all">

            {/* Top row */}
            <div className="flex flex-col md:flex-row md:items-center
                            justify-between gap-6 mb-6">

              {/* User avatar + info */}
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full flex items-center
                                justify-center text-white font-bold text-lg
                                flex-shrink-0"
                  style={{background:'linear-gradient(135deg,#002e0b,#0b4619)'}}>
                  {(w.users?.name || 'U')
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#191c1c]">
                    {w.users?.name || 'Unknown'}
                  </h3>
                  <p className="text-[#424940] text-sm">{w.users?.email}</p>
                </div>
              </div>

              {/* Status badge */}
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold
                               uppercase tracking-wider ${
                w.status === 'paid'
                  ? 'bg-[#9bf6b2] text-emerald-900'
                  : w.status === 'approved'
                  ? 'bg-blue-100 text-blue-800'
                  : w.status === 'rejected'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {w.status === 'pending_verification' ? 'Pending' : w.status}
              </span>
            </div>

            {/* Stats grid */}
            <div className="grid md:grid-cols-3 gap-6 p-6 rounded-[1.5rem]
                            bg-[#f2f4f3] mb-6">
              <div>
                <p className="text-xs text-[#424940] uppercase tracking-wider mb-1">
                  Match Type
                </p>
                <p className="font-bold text-[#002e0b] text-lg">
                  {w.match_count}-Match
                </p>
              </div>

              <div>
                <p className="text-xs text-[#424940] uppercase tracking-wider mb-1">
                  Prize
                </p>
                <p className="text-3xl font-headline font-extrabold text-[#006d37]">
                  ₹{(w.prize_amount || 0).toLocaleString('en-IN')}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#424940] uppercase tracking-wider mb-1">
                  Matched Numbers
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {w.matched_numbers?.map(n => (
                    <span key={n}
                      className="w-8 h-8 rounded-full bg-[#006d37] text-white
                                 flex items-center justify-center text-xs font-bold">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Proof link */}
            {w.proof_url && (
              <div className="flex items-center gap-2 text-[#006d37]
                              font-medium mb-4 text-sm">
                <span className="material-symbols-outlined text-sm">
                  description
                </span>
                <a href={w.proof_url} target="_blank" rel="noopener noreferrer"
                  className="underline hover:text-[#002e0b] transition-colors">
                  View Proof Screenshot
                </a>
              </div>
            )}

            {/* No proof warning */}
            {!w.proof_url && w.status === 'pending_verification' && (
              <div className="flex items-center gap-2 text-amber-700
                              bg-amber-50 px-4 py-2 rounded-full text-xs
                              font-medium mb-4 w-fit">
                <span className="material-symbols-outlined text-sm">warning</span>
                No proof submitted yet
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 border-t border-[#c1c9bd]/20 pt-5">
              {w.status === 'pending_verification' && (
                <>
                  <button
                    onClick={() => handleAction(w.id, 'reject')}
                    className="px-6 py-2.5 border-2 border-red-400 text-red-600
                               rounded-full text-sm font-bold
                               hover:bg-red-50 transition-colors">
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction(w.id, 'approve')}
                    className="px-6 py-2.5 rounded-full text-white text-sm
                               font-bold hover:scale-105 transition-transform
                               shadow-md"
                    style={{background:'linear-gradient(135deg,#002e0b,#0b4619)'}}>
                    Approve
                  </button>
                </>
              )}

              {/* ✅ Mark as Paid — shown when status is approved */}
              {w.status === 'approved' && (
                <button
                  onClick={() => handleAction(w.id, 'paid')}
                  className="px-6 py-2.5 rounded-full bg-[#9bf6b2]
                             text-emerald-900 font-bold text-sm
                             hover:bg-[#6bfe9c] transition-colors
                             flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm"
                    style={{fontVariationSettings:"'FILL' 1"}}>
                    payments
                  </span>
                  Mark as Paid
                </button>
              )}

              {/* Paid confirmation */}
              {w.status === 'paid' && (
                <div className="flex items-center gap-2 text-emerald-700
                                text-sm font-bold">
                  <span className="material-symbols-outlined text-sm"
                    style={{fontVariationSettings:"'FILL' 1"}}>
                    check_circle
                  </span>
                  Payout completed
                </div>
              )}

              {/* Re-open rejected — allow resubmission */}
              {w.status === 'rejected' && (
                <button
                  onClick={() => handleAction(w.id, 'pending_verification')}
                  className="px-6 py-2.5 border-2 border-[#c1c9bd]
                             text-[#424940] rounded-full text-sm font-bold
                             hover:bg-[#f2f4f3] transition-colors">
                  Re-open for Proof
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}