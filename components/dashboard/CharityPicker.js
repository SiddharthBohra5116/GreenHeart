'use client'

import { useState } from 'react'

const CATEGORY_COLORS = {
  Environment: { bg: '#9bf6b2', text: '#00210c' },
  Health:      { bg: '#c8e6c9', text: '#1b5e20' },
  Youth:       { bg: '#6bfe9c', text: '#00210c' },
  Community:   { bg: '#b2dfdb', text: '#004d40' },
  Sport:       { bg: '#dcedc8', text: '#33691e' },
  Education:   { bg: '#fff9c4', text: '#f57f17' },
}

export default function CharityPicker({
  charities = [],
  currentCharityId,
  currentPercentage = 10,
}) {
  const [selected,   setSelected]   = useState(currentCharityId)
  const [percentage, setPercentage] = useState(currentPercentage)
  const [loading,    setLoading]    = useState(false)
  const [message,    setMessage]    = useState({ text: '', ok: true })

  // ✅ Fixed — always uses latest percentage value at time of click
  const updateCharity = async (charityId) => {
    setLoading(true)
    setMessage({ text: '', ok: true })

    try {
      const res = await fetch('/api/user/update-charity', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          charityId,
          percentage, // ✅ uses current slider value
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSelected(charityId)
        setMessage({ text: '✓ Charity updated!', ok: true })
      } else {
        // ✅ Show actual error — not generic "something went wrong"
        setMessage({
          text: data.error || 'Update failed — please try again.',
          ok: false,
        })
      }
    } catch {
      setMessage({
        text: 'Network error — check your connection and try again.',
        ok: false,
      })
    } finally {
      setLoading(false)
    }
  }

  // Also allow updating just the percentage on slider change
  const updatePercentage = async (newPct) => {
    if (!selected) return // Nothing selected yet — just update local state
    setLoading(true)
    setMessage({ text: '', ok: true })

    try {
      const res = await fetch('/api/user/update-charity', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ charityId: selected, percentage: newPct }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage({ text: '✓ Contribution updated!', ok: true })
      } else {
        setMessage({ text: data.error || 'Update failed', ok: false })
      }
    } catch {
      setMessage({ text: 'Network error', ok: false })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel rounded-[2rem] p-8 shadow-sm">
      <h2 className="font-headline text-2xl font-extrabold text-[#002e0b] mb-2">
        My Charity
      </h2>
      <p className="text-[#424940] text-sm mb-6">
        Support a cause you care about.
      </p>

      {/* Percentage Slider */}
      <div className="bg-[#f2f4f3] rounded-[1.5rem] p-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-[#424940] uppercase
                           tracking-wider">
            Contribution
          </span>
          <span className="font-headline font-extrabold text-2xl text-[#002e0b]">
            {percentage}%
          </span>
        </div>
        <input
          type="range"
          min={10}
          max={50}
          value={percentage}
          onChange={(e) => setPercentage(Number(e.target.value))}
          onMouseUp={(e)  => updatePercentage(Number(e.target.value))}
          onTouchEnd={(e) => updatePercentage(Number(e.target.value))}
          className="w-full accent-[#006d37]"
        />
        <div className="flex justify-between text-[10px] text-[#72796f]
                        font-bold uppercase tracking-wider mt-1">
          <span>10% min</span>
          <span>50% max</span>
        </div>
      </div>

      {/* Charity List */}
      <div className="space-y-2">
        {charities.length === 0 ? (
          <div className="text-center py-8 bg-[#f2f4f3] rounded-[1.5rem]">
            <span className="material-symbols-outlined text-3xl text-[#c1c9bd]
                             block mb-2">
              volunteer_activism
            </span>
            <p className="text-[#424940] text-sm">
              No charities available yet.
            </p>
          </div>
        ) : (
          charities.map((c) => {
            const colors = CATEGORY_COLORS[c.category] ||
              { bg: '#eceeed', text: '#424940' }
            return (
              <button
                key={c.id}
                onClick={() => updateCharity(c.id)}
                disabled={loading}
                className={`w-full px-4 py-4 rounded-[1rem] text-left
                            transition-all border-2 ${
                  selected === c.id
                    ? 'border-[#006d37] bg-[#006d37]/5'
                    : 'border-transparent bg-[#f2f4f3] hover:bg-[#eceeed]'
                } disabled:opacity-60 disabled:cursor-not-allowed`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-[#002e0b]">
                      {c.name}
                    </span>
                    {c.category && (
                      <span className="px-2 py-0.5 rounded-full text-[10px]
                                       font-bold uppercase"
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text
                        }}>
                        {c.category}
                      </span>
                    )}
                  </div>
                  {selected === c.id && (
                    <span className="material-symbols-outlined text-[#006d37]
                                     text-lg"
                      style={{fontVariationSettings:"'FILL' 1"}}>
                      check_circle
                    </span>
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* Message */}
      {message.text && (
        <p className={`text-sm mt-4 text-center font-medium ${
          message.ok ? 'text-[#006d37]' : 'text-red-500'
        }`}>
          {message.text}
        </p>
      )}
    </div>
  )
}