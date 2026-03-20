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

  // ── Live filter — runs on every keystroke, no API call needed ──
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

  // ── Cancel subscription for a user (admin action) ─────────────
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
        // Optimistically update the UI without a full reload
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

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div>
        <h1 className="text-5xl font-extrabold font-headline text-[#002e0b] mb-2">
          Users
        </h1>
        <p className="text-[#424940] font-medium">
          Manage subscriptions, plans and charity preferences.
        </p>
      </div>

      {/* ── Search + Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-4">

        {/* Search input */}
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

        {/* Status filter pills */}
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

      {/* Result count */}
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
                </td>

              </tr>
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