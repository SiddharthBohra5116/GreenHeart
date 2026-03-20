'use client'

import { useState } from 'react'

export default function AdminDraw() {
  const [simulation, setSimulation] = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState('')
  const [drawLogic,  setDrawLogic]  = useState('random')

  const runSimulation = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    setSimulation(null)

    try {
      const res = await fetch('/api/draw/simulate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ draw_logic: drawLogic }),
      })
      const data = await res.json()
      if (res.ok) setSimulation(data)
      else setError(data.error || 'Simulation failed')
    } catch {
      setError('Network error — make sure you are logged in as admin.')
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
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(simulation),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(`Draw published! ${data.winnersInserted} winner(s) recorded.`)
        setSimulation(null)
      } else {
        setError(data.error || 'Publish failed')
      }
    } catch {
      setError('Network error — please try again.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-5xl font-extrabold font-headline text-[#002e0b] mb-2">
          Draw Management
        </h1>
        <p className="text-[#424940] font-medium max-w-xl">
          Simulate and publish monthly draws with complete financial transparency.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700
                        px-6 py-4 rounded-[1rem] text-sm font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-[#9bf6b2] text-emerald-900 px-6 py-4
                        rounded-[1rem] text-sm font-bold">
          {success}
        </div>
      )}

      {/* Step 1 — Configure + Simulate */}
      <div className="glass-panel p-8 rounded-[2rem] shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold text-[#c1c9bd]">01</span>
          <div>
            <h2 className="text-2xl font-bold font-headline text-[#002e0b]">
              Run Simulation
            </h2>
            <p className="text-sm text-[#424940]">
              Preview results before committing them to the system.
            </p>
          </div>
        </div>

        {/* Draw logic selector */}
        <div>
          <p className="text-xs font-bold text-[#424940] uppercase
                        tracking-wider mb-3">
            Draw Mode
          </p>
          <div className="flex gap-3">
            {[
              { val: 'random',      label: 'Random',       desc: 'Standard lottery' },
              { val: 'algorithmic', label: 'Algorithmic',  desc: 'Weighted by score frequency' },
            ].map((m) => (
              <button
                key={m.val}
                onClick={() => setDrawLogic(m.val)}
                disabled={!!simulation}
                className={`px-5 py-3 rounded-[1rem] text-left transition-all
                            border-2 flex-1 disabled:opacity-50 ${
                  drawLogic === m.val
                    ? 'border-[#006d37] bg-[#006d37]/5'
                    : 'border-[#c1c9bd] bg-[#f2f4f3] hover:bg-[#eceeed]'
                }`}>
                <div className="font-bold text-sm text-[#002e0b]">{m.label}</div>
                <div className="text-xs text-[#424940] mt-0.5">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={runSimulation}
          disabled={loading || !!simulation}
          className="px-8 py-3 rounded-full text-white font-bold
                     hover:scale-105 transition-all disabled:opacity-50
                     disabled:cursor-not-allowed flex items-center gap-2"
          style={{background:'linear-gradient(135deg,#002e0b,#0b4619)'}}>
          {loading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/30
                               border-t-white animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[#6bfe9c]">
                casino
              </span>
              Run Simulation
            </>
          )}
        </button>
      </div>

      {/* Simulation Results */}
      {simulation && (
        <div className="space-y-8">

          {/* Draw header */}
          <div className="glass-panel p-8 rounded-[2rem] border border-[#c1c9bd]/30">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold font-headline text-[#002e0b]">
                  Simulation — {simulation.drawMonth}
                </h2>
                <p className="text-xs text-[#424940] mt-1 capitalize">
                  Mode: {simulation.drawLogic || 'random'}
                </p>
              </div>
              <span className="px-4 py-1.5 rounded-full text-xs font-bold
                               bg-amber-100 text-amber-800 uppercase">
                Not Published
              </span>
            </div>

            {/* Drawn numbers */}
            <div>
              <p className="text-xs uppercase tracking-wider text-[#424940]
                             font-bold mb-3">
                Drawn Numbers
              </p>
              <div className="flex gap-3 flex-wrap">
                {simulation.numbers.map(n => (
                  <div key={n}
                    className="w-12 h-12 rounded-full flex items-center
                               justify-center font-bold text-white text-lg"
                    style={{background:'linear-gradient(135deg,#002e0b,#0b4619)'}}>
                    {n}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pool cards — INR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Pool',    val: `₹${simulation.totalPool.toLocaleString('en-IN')}` },
              { label: 'Carry Forward', val: `₹${simulation.carryForward.toLocaleString('en-IN')}` },
              { label: 'Next Carry',    val: `₹${simulation.newCarryForward.toLocaleString('en-IN')}` },
            ].map((c) => (
              <div key={c.label} className="glass-panel p-6 rounded-[1.5rem]">
                <p className="text-xs text-[#424940] font-bold uppercase
                               tracking-wider mb-2">
                  {c.label}
                </p>
                <p className="text-3xl font-bold font-headline text-[#002e0b]">
                  {c.val}
                </p>
              </div>
            ))}
          </div>

          {/* Winners table */}
          <div className="glass-panel rounded-[2rem] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#f2f4f3] border-b border-[#c1c9bd]/20">
                <tr>
                  {['Tier', 'Winners', 'Prize Each'].map(h => (
                    <th key={h}
                      className="text-left px-6 py-4 text-xs uppercase
                                 tracking-wider text-[#424940] font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c1c9bd]/10">
                <tr className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#002e0b]">
                    <span className="material-symbols-outlined text-amber-500
                                     mr-2 align-middle text-base"
                      style={{fontVariationSettings:"'FILL' 1"}}>
                      emoji_events
                    </span>
                    Jackpot (5-match)
                  </td>
                  <td className="px-6 py-4 font-medium text-[#191c1c]">
                    {simulation.winners.five.count}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#006d37]">
                    {simulation.winners.five.count > 0
                      ? `₹${simulation.winners.five.prize.toLocaleString('en-IN')}`
                      : <span className="text-amber-600 font-bold">Rollover →</span>}
                  </td>
                </tr>
                <tr className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#191c1c]">
                    Tier 2 (4-match)
                  </td>
                  <td className="px-6 py-4 font-medium text-[#191c1c]">
                    {simulation.winners.four.count}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#006d37]">
                    ₹{simulation.winners.four.prize.toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#191c1c]">
                    Tier 3 (3-match)
                  </td>
                  <td className="px-6 py-4 font-medium text-[#191c1c]">
                    {simulation.winners.three.count}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#006d37]">
                    ₹{simulation.winners.three.prize.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Step 2 — Publish */}
          <div className="glass-panel p-8 rounded-[2rem] shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-[#c1c9bd]">02</span>
              <div>
                <h2 className="text-2xl font-bold font-headline text-[#002e0b]">
                  Publish Draw
                </h2>
                <p className="text-sm text-[#424940]">
                  This saves the draw and notifies winners. Cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={publishDraw}
                disabled={publishing}
                className="px-8 py-3 rounded-full text-white font-bold
                           hover:scale-105 transition-all disabled:opacity-50
                           flex items-center gap-2"
                style={{background:'linear-gradient(135deg,#006d37,#0b4619)'}}>
                {publishing ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2
                                     border-white/30 border-t-white animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[#6bfe9c]">
                      publish
                    </span>
                    Publish Draw
                  </>
                )}
              </button>

              <button
                onClick={() => setSimulation(null)}
                className="px-8 py-3 rounded-full border-2 border-[#c1c9bd]
                           text-[#424940] hover:bg-[#f2f4f3] transition-colors
                           font-bold">
                Discard & Re-run
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}