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
  const all = winners

  const displayed = tab === 'pending' ? pending : all

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[#c9a84c] text-xs tracking-[3px] uppercase mb-2">Verification</p>
        <h1 className="font-playfair text-5xl">Winners</h1>
        <div className="w-12 h-0.5 bg-[#c9a84c] mt-3"></div>
      </div>

      {message && (
        <div className="border border-emerald-900 bg-emerald-900/20 px-6 py-4
                        text-emerald-400 text-sm">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#1a4a2e]">
        {[
          { key: 'pending', label: `Pending (${pending.length})` },
          { key: 'all', label: `All Winners (${all.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-6 py-3 text-sm font-bold tracking-wider uppercase
                        border-b-2 transition-colors ${
              tab === t.key
                ? 'border-[#c9a84c] text-[#c9a84c]'
                : 'border-transparent text-[#4a5a4e] hover:text-[#7a9e7e]'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Winners List */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-12 text-[#4a5a4e]">Loading...</div>
        )}

        {!loading && displayed.length === 0 && (
          <div className="text-center py-16 border border-[#1a4a2e]">
            <p className="font-playfair text-2xl text-[#4a5a4e] mb-2">
              {tab === 'pending' ? 'No pending verifications' : 'No winners yet'}
            </p>
          </div>
        )}

        {displayed.map(w => (
          <div key={w.id} className="border border-[#1a4a2e] p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-lg">{w.users?.name || 'Unknown'}</div>
                <div className="text-[#4a5a4e] text-sm">{w.users?.email}</div>
              </div>
              <span className={`text-xs font-bold uppercase px-3 py-1 ${
                w.status === 'paid' ? 'bg-emerald-900/30 text-emerald-400'
                : w.status === 'approved' ? 'bg-blue-900/30 text-blue-400'
                : w.status === 'rejected' ? 'bg-red-900/30 text-red-400'
                : 'bg-yellow-900/30 text-yellow-400'
              }`}>
                {w.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-xs text-[#4a5a4e] uppercase tracking-wider mb-1">Match</div>
                <div className="font-bold text-[#c9a84c]">{w.match_count}-Match</div>
              </div>
              <div>
                <div className="text-xs text-[#4a5a4e] uppercase tracking-wider mb-1">Prize</div>
                <div className="font-playfair text-2xl">£{w.prize_amount?.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-[#4a5a4e] uppercase tracking-wider mb-1">
                  Matched Numbers
                </div>
                <div className="flex gap-1">
                  {w.matched_numbers?.map(n => (
                    <span key={n}
                      className="bg-[#c9a84c] text-[#0a0f0a] w-7 h-7 flex items-center
                                 justify-center text-xs font-bold">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {w.proof_url && (
              <div>
                <div className="text-xs text-[#4a5a4e] uppercase tracking-wider mb-1">Proof</div>
                <div className="text-[#7a9e7e] text-sm break-all">{w.proof_url}</div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-[#1a4a2e]">
              {w.status === 'pending_verification' && (
                <>
                  <button onClick={() => handleAction(w.id, 'approve')}
                    className="bg-emerald-700 text-white px-6 py-2 text-xs font-bold
                               tracking-wider uppercase hover:bg-emerald-600 transition-colors">
                    ✓ Approve
                  </button>
                  <button onClick={() => handleAction(w.id, 'reject')}
                    className="border border-red-900 text-red-400 px-6 py-2 text-xs
                               font-bold tracking-wider uppercase hover:bg-red-900/20
                               transition-colors">
                    ✗ Reject
                  </button>
                </>
              )}
              {w.status === 'approved' && (
                <button onClick={() => handleAction(w.id, 'paid')}
                  className="bg-[#c9a84c] text-[#0a0f0a] px-6 py-2 text-xs font-bold
                             tracking-wider uppercase hover:bg-[#b8943d] transition-colors">
                  £ Mark as Paid
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}