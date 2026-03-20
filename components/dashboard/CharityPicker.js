'use client'

import { useState } from 'react'

export default function CharityPicker({
  charities = [],
  currentCharityId,
  currentPercentage = 10,
}) {
  const [selected, setSelected] = useState(currentCharityId)
  const [percentage, setPercentage] = useState(currentPercentage)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const updateCharity = async (id) => {
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/user/update-charity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charityId: id, percentage }),
      })

      if (res.ok) {
        setSelected(id)
        setMessage('Charity updated!')
      } else {
        const data = await res.json()
        setMessage(data.error || 'Update failed')
      }
    } catch {
      setMessage('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-[#1a4a2e] p-6">
      <p className="text-[#c9a84c] text-xs tracking-[3px] uppercase mb-1">Support</p>
      <h2 className="font-playfair text-2xl mb-6">My Charity</h2>

      {/* Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-[#4a5a4e] uppercase tracking-wider">
            Contribution
          </p>
          <p className="font-playfair text-2xl text-[#c9a84c]">{percentage}%</p>
        </div>
        <input
          type="range"
          min={10}
          max={50}
          value={percentage}
          onChange={(e) => setPercentage(Number(e.target.value))}
          className="w-full accent-[#c9a84c]"
        />
        <div className="flex justify-between text-xs text-[#2a3a2e] mt-1">
          <span>10% min</span>
          <span>50% max</span>
        </div>
      </div>

      {/* Charity List */}
      <div className="space-y-2">
        {charities.length === 0 ? (
          <p className="text-[#4a5a4e] text-sm">No charities available.</p>
        ) : (
          charities.map((c) => (
            <button
              key={c.id}
              onClick={() => updateCharity(c.id)}
              disabled={loading}
              className={`w-full px-4 py-3 border text-left transition-all ${
                selected === c.id
                  ? 'border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c]'
                  : 'border-[#1a4a2e] text-[#7a9e7e] hover:border-[#c9a84c]/50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{c.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-50 capitalize">{c.category}</span>
                  {selected === c.id && (
                    <span className="text-[#c9a84c] text-xs font-bold">✓</span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {message && (
        <p className={`text-sm mt-4 ${
          message.includes('updated') ? 'text-emerald-400' : 'text-red-400'
        }`}>
          {message}
        </p>
      )}
    </div>
  )
}