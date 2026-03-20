// components/admin/AdminUsersClient.js
'use client'

import { useState } from 'react'

const PLAN_LABELS = {
  monthly: '₹799/mo',
  yearly:  '₹7,999/yr',
}

export default function AdminUsersClient({ users = [] }) {
  const [query,        setQuery]        = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cancelling,   setCancelling]   = useState(null)
  const [message,      setMessage]      = useState('')
  const [expandedUser, setExpandedUser] = useState(null)
  const [userScores,   setUserScores]   = useState({})
  const [scoreForm,    setScoreForm]    = useState({ score: '', date: new Date().toISOString().split('T')[0] })
  const [scoreLoading, setScoreLoading] = useState(false)
  const [scoreMsg,     setScoreMsg]     = useState('')

  // ── Live filter ────────────────────────────────────────────────
  const filtered = users.filter((u) => {
    const q = query.toLowerCase()
    const matchesSearch =
      !q ||
      (u.name  || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.subscription_plan || '').toLowerCase().includes(q) ||
      (u.charities?.name || '').toLowerCase().includes(q)

    const matchesStatus =
      statusFilter === 'all' ||
      (u.subscription_status || 'inactive') === statusFilter

    return matchesSearch && matchesStatus
  })

  // ── Cancel subscription ────────────────────────────────────────
  async function handleCancel(userId, userName) {
    if (!confirm(`Cancel subscription for ${userName}? This cannot be undone.`)) return

    setCancelling(userId)
    setMessage('')

    try {
      const res = await fetch('/api/admin/users/cancel', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ userId }),
      })
      const data = await res.json()

      if (res.ok) {
        setMessage(`✓ Subscription cancelled for ${userName}`)
        window.location.reload()
      } else {
        setMessage(`✗ ${data.error || 'Failed to cancel'}`)
      }
    } catch {
      setMessage('✗ Network error. Please try again.')
    } finally {
      setCancelling(null)
    }
  }

  // ── Load scores for user ────────────────────────────────────────
  async function loadScores(userId) {
    if (expandedUser === userId) {
      setExpandedUser(null)
      return
    }
    setExpandedUser(userId)
    setScoreMsg('')
    try {
      const res  = await fetch(`/api/admin/users/scores?userId=${userId}`)
      const data = await res.json()
      setUserScores(prev => ({ ...prev, [userId]: data.scores || [] }))
    } catch {
      setUserScores(prev => ({ ...prev, [userId]: [] }))
    }
  }

  // ── Add score for user ─────────────────────────────────────────
  async function handleAddScore(userId) {
    setScoreLoading(true)
    setScoreMsg('')
    try {
      const res = await fetch('/api/admin/users/scores', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ userId, ...scoreForm }),
      })
      const data = await res.json()
      if (res.ok) {
        setScoreMsg('✓ Score added')
        setScoreForm({ score: '', date: new Date().toISOString().split('T')[0] })
        // Refresh scores for this user
        const refresh  = await fetch(`/api/admin/users/scores?userId=${userId}`)
        const refreshD = await refresh.json()
        setUserScores(prev => ({ ...prev, [userId]: refreshD.scores || [] }))
      } else {
        setScoreMsg(`✗ ${data.error || 'Failed to add score'}`)
      }
    } catch {
      setScoreMsg('✗ Network error')
    } finally {
      setScoreLoading(false)
    }
  }

  // ── Delete score ───────────────────────────────────────────────
  async function handleDeleteScore(scoreId, userId) {
    setScoreMsg('')
    try {
      const res  = await fetch(`/api/admin/users/scores?id=${scoreId}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        setScoreMsg('✓ Score deleted')
        setUserScores(prev => ({
          ...prev,
          [userId]: (prev[userId] || []).filter(s => s.id !== scoreId),
        }))
      } else {
        setScoreMsg(`✗ ${data.error}`)
      }
    } catch {
      setScoreMsg('✗ Network error')
    }
  }

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div>
        <h1 className="text-5xl font-extrabold font-headline text-[#002e0b] mb-2">
          Users
        </h1>
        <p className="text-[#424940] font-medium">
          Manage subscriptions, plans, charity preferences and golf scores.
        </p>
      </div>

      {/* ── Search + Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2
                           -translate-y-1/2 text-[#424940] text-xl pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name, email, plan or charity…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-5 py-3 rounded-full bg-white
                       border border-[#c1c9bd] text-sm text-[#191c1c]
                       placeholder:text-[#72796f] outline-none
                       focus:border-[#006d37] focus:ring-2
                       focus:ring-[#006d37]/10 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2
                         text-[#424940] hover:text-[#191c1c]">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-shrink-0">
          {[
            { val: 'all',      label: 'All' },
            { val: 'active',   label: 'Active' },
            { val: 'inactive', label: 'Inactive' },
          ].map((f) => (
            <button
              key={f.val}
              onClick={() => setStatusFilter(f.val)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold
                          transition-all ${
                statusFilter === f.val
                  ? 'text-white shadow-md'
                  : 'bg-white border border-[#c1c9bd] text-[#424940] hover:bg-[#f2f4f3]'
              }`}
              style={statusFilter === f.val
                ? { background: 'linear-gradient(135deg,#002e0b,#0b4619)' }
                : {}}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-[#424940] font-medium -mt-2">
        Showing <span className="font-bold text-[#002e0b]">{filtered.length}</span> of{' '}
        <span className="font-bold text-[#002e0b]">{users.length}</span> users
        {query && <span> matching &ldquo;{query}&rdquo;</span>}
      </p>

      {/* ── Message ── */}
      {message && (
        <div className={`px-5 py-3 rounded-full text-sm font-medium ${
          message.startsWith('✓')
            ? 'bg-[#9bf6b2] text-emerald-900'
            : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* ── Table ── */}
      <div className="glass-panel rounded-[2rem] overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[#f2f4f3] border-b border-[#c1c9bd]/20">
            <tr>
              {['User', 'Plan', 'Status', 'Expiry', 'Charity', 'Actions'].map((h) => (
                <th key={h}
                  className="text-left px-6 py-4 text-xs font-bold uppercase
                             tracking-wider text-[#424940]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#c1c9bd]/10">
            {filtered.map((u) => (
              <>
                <tr key={u.id} className="hover:bg-white/40 transition-colors">

                  {/* User */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center
                                      justify-center text-white text-xs font-bold
                                      flex-shrink-0"
                        style={{background:'linear-gradient(135deg,#002e0b,#0b4619)'}}>
                        {(u.name || 'U')
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[#191c1c]">
                          {u.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-[#424940]">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Plan */}
                  <td className="px-6 py-4">
                    {u.subscription_plan ? (
                      <div>
                        <span className="font-bold text-[#002e0b] capitalize text-sm">
                          {u.subscription_plan}
                        </span>
                        <span className="block text-xs text-[#424940] mt-0.5">
                          {PLAN_LABELS[u.subscription_plan] || '—'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#424940]">—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold
                                     uppercase tracking-wider ${
                      u.subscription_status === 'active'
                        ? 'bg-[#9bf6b2] text-emerald-900'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {u.subscription_status || 'inactive'}
                    </span>
                  </td>

                  {/* Expiry */}
                  <td className="px-6 py-4 text-[#424940] text-xs">
                    {u.subscription_expiry
                      ? new Date(u.subscription_expiry).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })
                      : '—'}
                  </td>

                  {/* Charity */}
                  <td className="px-6 py-4 text-[#006d37] font-medium text-xs">
                    {u.charities?.name || '—'}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* Scores button */}
                      <button
                        onClick={() => loadScores(u.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold
                                   transition-all border ${
                          expandedUser === u.id
                            ? 'bg-[#002e0b] text-white border-[#002e0b]'
                            : 'bg-white border-[#c1c9bd] text-[#424940] hover:bg-[#f2f4f3]'
                        }`}>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">sports_golf</span>
                          Scores
                        </span>
                      </button>

                      {/* Cancel sub */}
                      {u.subscription_status === 'active' ? (
                        <button
                          onClick={() => handleCancel(u.id, u.name || u.email)}
                          disabled={cancelling === u.id}
                          className="px-3 py-1.5 rounded-full text-xs font-bold
                                     bg-red-50 text-red-600 border border-red-200
                                     hover:bg-red-100 transition-all
                                     disabled:opacity-50 disabled:cursor-not-allowed">
                          {cancelling === u.id ? 'Cancelling…' : 'Cancel Sub'}
                        </button>
                      ) : (
                        <span className="text-xs text-[#c1c9bd]">—</span>
                      )}
                    </div>
                  </td>
                </tr>

                {/* ── Expanded Score Panel ── */}
                {expandedUser === u.id && (
                  <tr key={`scores-${u.id}`}>
                    <td colSpan={6} className="px-6 pb-6 bg-[#f8faf9]">
                      <div className="border border-[#c1c9bd]/30 rounded-[1.5rem]
                                      p-6 bg-white">
                        <h4 className="font-bold text-[#002e0b] mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#006d37]">
                            sports_golf
                          </span>
                          Golf Scores for {u.name || u.email}
                        </h4>

                        {/* Score message */}
                        {scoreMsg && (
                          <div className={`mb-4 px-4 py-2 rounded-full text-xs font-medium ${
                            scoreMsg.startsWith('✓')
                              ? 'bg-[#9bf6b2] text-emerald-900'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {scoreMsg}
                          </div>
                        )}

                        {/* Current scores */}
                        <div className="flex flex-wrap gap-3 mb-5">
                          {(userScores[u.id] || []).length === 0 ? (
                            <p className="text-sm text-[#424940]">No scores recorded.</p>
                          ) : (
                            (userScores[u.id] || []).map((s) => (
                              <div key={s.id}
                                className="flex items-center gap-2 bg-[#f2f4f3]
                                           px-4 py-2 rounded-full">
                                <span className="font-bold text-[#002e0b]">{s.score}</span>
                                <span className="text-xs text-[#424940]">
                                  {new Date(s.date).toLocaleDateString('en-GB')}
                                </span>
                                <button
                                  onClick={() => handleDeleteScore(s.id, u.id)}
                                  className="text-red-400 hover:text-red-600 transition-colors ml-1">
                                  <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add score form */}
                        <div className="flex gap-3 flex-wrap items-end">
                          <div>
                            <label className="text-xs font-bold text-[#424940]
                                             uppercase tracking-wider block mb-1">
                              Score (1–45)
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={45}
                              value={scoreForm.score}
                              onChange={(e) => setScoreForm(p => ({ ...p, score: e.target.value }))}
                              className="bg-[#f2f4f3] border-none rounded-[1rem]
                                         px-4 py-2.5 outline-none text-sm w-28
                                         focus:ring-2 focus:ring-[#006d37]"
                              placeholder="e.g. 32"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-[#424940]
                                             uppercase tracking-wider block mb-1">
                              Date
                            </label>
                            <input
                              type="date"
                              value={scoreForm.date}
                              max={new Date().toISOString().split('T')[0]}
                              onChange={(e) => setScoreForm(p => ({ ...p, date: e.target.value }))}
                              className="bg-[#f2f4f3] border-none rounded-[1rem]
                                         px-4 py-2.5 outline-none text-sm
                                         focus:ring-2 focus:ring-[#006d37]"
                            />
                          </div>
                          <button
                            onClick={() => handleAddScore(u.id)}
                            disabled={scoreLoading}
                            className="px-5 py-2.5 rounded-full text-white text-xs
                                       font-bold hover:scale-105 transition-all
                                       disabled:opacity-50"
                            style={{background:'linear-gradient(135deg,#002e0b,#0b4619)'}}>
                            {scoreLoading ? 'Adding…' : 'Add Score'}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-[#c1c9bd] block mb-3">
              {query ? 'search_off' : 'group'}
            </span>
            <p className="text-lg font-headline text-[#424940]">
              {query ? `No users match "${query}"` : 'No users yet'}
            </p>
            {query && (
              <button
                onClick={() => { setQuery(''); setStatusFilter('all') }}
                className="mt-4 text-sm text-[#006d37] font-bold hover:underline">
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}