// components/home/DonateButton.js
'use client'

import { useState } from 'react'

/**
 * DonateButton — shown on charity profile pages
 * PRD §08: "Independent donation option (not tied to gameplay)"
 *
 * Props:
 *   charityId   — UUID of the charity
 *   charityName — display name for confirmation message
 */
export default function DonateButton({ charityId, charityName }) {
  const [open,    setOpen]    = useState(false)
  const [amount,  setAmount]  = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')

  const PRESET_AMOUNTS = [100, 250, 500, 1000]

  const handleDonate = async () => {
    setError('')
    const parsed = parseFloat(amount)
    if (!parsed || parsed < 1) {
      setError('Please enter a valid amount (minimum ₹1)')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/donations', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ charityId, amount: parsed }),
      })
      const data = await res.json()

      if (res.ok) {
        setSuccess(data.message || 'Donation recorded! Thank you.')
        setAmount('')
      } else {
        // If not logged in, suggest login
        if (res.status === 401) {
          setError('Please log in to make a donation.')
        } else {
          setError(data.error || 'Donation failed. Please try again.')
        }
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="glass-panel px-8 py-4 rounded-full font-bold border
                   border-[#006d37]/30 hover:bg-[#006d37]/5 transition-colors
                   text-[#006d37] flex items-center gap-2">
        <span className="material-symbols-outlined text-lg">favorite</span>
        Donate Now
      </button>
    )
  }

  return (
    <div className="glass-panel rounded-[2rem] p-6 border border-[#006d37]/20
                    w-full max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-headline font-extrabold text-[#002e0b]">
          Donate to {charityName}
        </h3>
        <button
          onClick={() => { setOpen(false); setError(''); setSuccess('') }}
          className="text-[#72796f] hover:text-[#191c1c] transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {success ? (
        <div className="text-center py-4">
          <span className="material-symbols-outlined text-4xl text-[#006d37]
                           block mb-2"
            style={{fontVariationSettings:"'FILL' 1"}}>
            favorite
          </span>
          <p className="text-[#006d37] font-bold text-sm">{success}</p>
          <button
            onClick={() => { setSuccess(''); setOpen(false) }}
            className="mt-4 text-xs text-[#424940] hover:text-[#191c1c]
                       font-medium underline">
            Close
          </button>
        </div>
      ) : (
        <>
          {/* Preset amounts */}
          <div className="flex gap-2 flex-wrap mb-4">
            {PRESET_AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(String(a))}
                className={`px-4 py-2 rounded-full text-sm font-bold
                            transition-all ${
                  amount === String(a)
                    ? 'text-white shadow-md'
                    : 'bg-[#f2f4f3] text-[#424940] hover:bg-[#eceeed]'
                }`}
                style={amount === String(a)
                  ? { background: 'linear-gradient(135deg,#002e0b,#0b4619)' }
                  : {}}>
                ₹{a.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2
                             text-[#424940] font-bold text-sm">
              ₹
            </span>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Custom amount"
              className="w-full bg-[#f2f4f3] border-none rounded-full
                         pl-8 pr-4 py-3 text-sm text-[#191c1c] outline-none
                         focus:ring-2 focus:ring-[#006d37]
                         placeholder:text-[#72796f]"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 mb-3 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </p>
          )}

          <button
            onClick={handleDonate}
            disabled={loading || !amount}
            className="w-full py-3 rounded-full text-white font-bold text-sm
                       hover:scale-105 transition-all disabled:opacity-50
                       disabled:cursor-not-allowed disabled:hover:scale-100
                       flex items-center justify-center gap-2"
            style={{background:'linear-gradient(135deg,#002e0b,#0b4619)'}}>
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30
                                 border-t-white rounded-full animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[#6bfe9c] text-sm">
                  favorite
                </span>
                Donate {amount ? `₹${parseFloat(amount).toLocaleString('en-IN')}` : ''}
              </>
            )}
          </button>

          <p className="text-xs text-[#72796f] text-center mt-3">
            Demo only — no real payment processed
          </p>
        </>
      )}
    </div>
  )
}