'use client'

import { useState } from 'react'

export default function AdminDraw() {
  const [simulation, setSimulation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const runSimulation = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    setSimulation(null)

    try {
      const res = await fetch('/api/draw/simulate', { method: 'POST' })
      const data = await res.json()

      if (res.ok) {
        setSimulation(data)
      } else {
        setError(data.error || 'Simulation failed')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const publishDraw = async () => {
    if (!simulation) return
    setPublishing(true)
    setError('')

    try {
      const res = await fetch('/api/draw/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simulation),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(`Draw published! ${data.winnersInserted} winners recorded.`)
        setSimulation(null)
      } else {
        setError(data.error || 'Publish failed')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[#c9a84c] text-xs tracking-[3px] uppercase mb-2">Monthly</p>
        <h1 className="font-playfair text-5xl">Draw Management</h1>
        <div className="w-12 h-0.5 bg-[#c9a84c] mt-3"></div>
      </div>

      {error && (
        <div className="border border-red-900 bg-red-900/20 px-6 py-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="border border-emerald-900 bg-emerald-900/20 px-6 py-4
                        text-emerald-400 text-sm">
          {success}
        </div>
      )}

      {/* Step 1 */}
      <div className="border border-[#1a4a2e] p-8">
        <div className="flex items-center gap-4 mb-6">
          <span className="font-playfair text-4xl text-[#c9a84c] opacity-40">01</span>
          <div>
            <h2 className="font-playfair text-2xl">Run Simulation</h2>
            <p className="text-[#4a5a4e] text-sm mt-1">
              Preview draw results without saving to database
            </p>
          </div>
        </div>

        <button
          onClick={runSimulation}
          disabled={loading || !!simulation}
          className="bg-[#c9a84c] text-[#0a0f0a] px-8 py-3 font-bold tracking-widest
                     uppercase text-sm hover:bg-[#b8943d] transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : '▶ Run Simulation'}
        </button>
      </div>

      {/* Simulation Results */}
      {simulation && (
        <div className="border border-[#c9a84c] p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-playfair text-2xl text-[#c9a84c]">
              Simulation Preview — {simulation.drawMonth}
            </h2>
            <span className="text-xs bg-yellow-900/30 text-yellow-400 px-3 py-1
                             uppercase tracking-wider font-bold">
              Not Saved
            </span>
          </div>

          {/* Drawn Numbers */}
          <div>
            <p className="text-xs text-[#4a5a4e] uppercase tracking-wider mb-3">
              Drawn Numbers
            </p>
            <div className="flex gap-3">
              {simulation.numbers.map((n) => (
                <div key={n}
                  className="w-12 h-12 border-2 border-[#c9a84c] bg-[#0f2d1a]
                             flex items-center justify-center font-playfair
                             text-xl text-[#c9a84c]">
                  {n}
                </div>
              ))}
            </div>
          </div>

          {/* Pool Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-[#1a4a2e] p-4">
              <div className="text-xs text-[#4a5a4e] uppercase tracking-wider mb-1">
                Total Pool
              </div>
              <div className="font-playfair text-3xl text-[#f0ece0]">
                £{simulation.totalPool}
              </div>
            </div>
            <div className="border border-[#1a4a2e] p-4">
              <div className="text-xs text-[#4a5a4e] uppercase tracking-wider mb-1">
                Carry Forward In
              </div>
              <div className="font-playfair text-3xl text-[#c9a84c]">
                £{simulation.carryForward}
              </div>
            </div>
            <div className="border border-[#1a4a2e] p-4">
              <div className="text-xs text-[#4a5a4e] uppercase tracking-wider mb-1">
                Next Carry Forward
              </div>
              <div className="font-playfair text-3xl text-[#f0ece0]">
                £{simulation.newCarryForward}
              </div>
            </div>
          </div>

          {/* Winners Preview */}
          <div>
            <p className="text-xs text-[#4a5a4e] uppercase tracking-wider mb-3">
              Winner Preview
            </p>
            <table className="w-full text-sm border border-[#1a4a2e]">
              <thead>
                <tr className="bg-[#0f2d1a] border-b border-[#1a4a2e]">
                  {['Tier', 'Winners', 'Prize Each'].map(h => (
                    <th key={h}
                      className="text-left px-4 py-3 text-xs text-[#4a5a4e]
                                 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a4a2e]">
                <tr>
                  <td className="px-4 py-3">🏆 5-Match (Jackpot)</td>
                  <td className="px-4 py-3 text-[#c9a84c] font-bold">
                    {simulation.winners.five.count}
                  </td>
                  <td className="px-4 py-3">
                    {simulation.winners.five.count > 0
                      ? `£${simulation.winners.five.prize}`
                      : 'Rollover →'}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">🥈 4-Match</td>
                  <td className="px-4 py-3 text-[#c9a84c] font-bold">
                    {simulation.winners.four.count}
                  </td>
                  <td className="px-4 py-3">
                    {simulation.winners.four.count > 0
                      ? `£${simulation.winners.four.prize}`
                      : '—'}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">🥉 3-Match</td>
                  <td className="px-4 py-3 text-[#c9a84c] font-bold">
                    {simulation.winners.three.count}
                  </td>
                  <td className="px-4 py-3">
                    {simulation.winners.three.count > 0
                      ? `£${simulation.winners.three.prize}`
                      : '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Step 2 — Publish */}
          <div className="flex gap-4 pt-4 border-t border-[#1a4a2e]">
            <button
              onClick={publishDraw}
              disabled={publishing}
              className="bg-emerald-700 text-white px-8 py-3 font-bold tracking-widest
                         uppercase text-sm hover:bg-emerald-600 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {publishing ? 'Publishing...' : '📢 Publish Draw'}
            </button>
            <button
              onClick={() => { setSimulation(null); setError('') }}
              className="border border-[#1a4a2e] text-[#4a5a4e] px-8 py-3 text-sm
                         font-bold tracking-widest uppercase hover:border-red-900
                         hover:text-red-400 transition-colors"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}