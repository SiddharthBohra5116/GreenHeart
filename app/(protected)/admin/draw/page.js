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

      if (res.ok) setSimulation(data)
      else setError(data.error || 'Simulation failed')
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
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-5xl font-extrabold font-headline text-primary mb-2">
          Draw Management
        </h1>
        <p className="text-on-surface-variant font-medium max-w-xl">
          Simulate and publish monthly draws with complete financial transparency.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="glass-panel border border-red-300 text-red-600 px-6 py-4 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="glass-panel border border-emerald-300 text-emerald-700 px-6 py-4 rounded-xl">
          {success}
        </div>
      )}

      {/* STEP 1 */}
      <div className="glass-panel p-8 rounded-2xl shadow-sm space-y-6">

        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold text-outline/40">01</span>
          <div>
            <h2 className="text-2xl font-bold font-headline text-primary">
              Run Simulation
            </h2>
            <p className="text-sm text-on-surface-variant">
              Preview results before committing them to the system.
            </p>
          </div>
        </div>

        <button
          onClick={runSimulation}
          disabled={loading || !!simulation}
          className="px-8 py-3 rounded-full soulful-gradient text-white font-semibold
                     shadow-lg hover:scale-105 transition-all disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Run Simulation'}
        </button>
      </div>

      {/* SIMULATION */}
      {simulation && (
        <div className="space-y-8">

          {/* HEADER */}
          <div className="glass-panel p-8 rounded-2xl border border-outline-variant/20">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-headline text-primary">
                Simulation — {simulation.drawMonth}
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                Not Published
              </span>
            </div>

            {/* Numbers */}
            <div>
              <p className="text-xs uppercase tracking-wider text-on-surface-variant mb-3">
                Drawn Numbers
              </p>

              <div className="flex gap-3">
                {simulation.numbers.map(n => (
                  <div key={n}
                    className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
                    {n}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* POOL CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="glass-panel p-6 rounded-xl">
              <p className="text-xs text-on-surface-variant mb-1">Total Pool</p>
              <p className="text-3xl font-bold font-headline text-primary">
                £{simulation.totalPool}
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <p className="text-xs text-on-surface-variant mb-1">Carry Forward</p>
              <p className="text-3xl font-bold text-secondary">
                £{simulation.carryForward}
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <p className="text-xs text-on-surface-variant mb-1">Next Carry</p>
              <p className="text-3xl font-bold font-headline text-primary">
                £{simulation.newCarryForward}
              </p>
            </div>

          </div>

          {/* WINNERS TABLE */}
          <div className="glass-panel rounded-xl overflow-hidden">

            <table className="w-full text-sm">
              <thead className="bg-surface-container">
                <tr>
                  {['Tier', 'Winners', 'Prize'].map(h => (
                    <th key={h}
                      className="text-left px-6 py-4 text-xs uppercase tracking-wider text-on-surface-variant">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-outline-variant/20">

                <tr>
                  <td className="px-6 py-4 font-semibold">🏆 Jackpot</td>
                  <td className="px-6 py-4">{simulation.winners.five.count}</td>
                  <td className="px-6 py-4">
                    {simulation.winners.five.count
                      ? `£${simulation.winners.five.prize}`
                      : 'Rollover'}
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4">🥈 Tier 2</td>
                  <td className="px-6 py-4">{simulation.winners.four.count}</td>
                  <td className="px-6 py-4">£{simulation.winners.four.prize}</td>
                </tr>

                <tr>
                  <td className="px-6 py-4">🥉 Tier 3</td>
                  <td className="px-6 py-4">{simulation.winners.three.count}</td>
                  <td className="px-6 py-4">£{simulation.winners.three.prize}</td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">

            <button
              onClick={publishDraw}
              disabled={publishing}
              className="px-8 py-3 rounded-full bg-secondary text-white font-semibold
                         hover:scale-105 transition-all disabled:opacity-50"
            >
              {publishing ? 'Publishing...' : 'Publish Draw'}
            </button>

            <button
              onClick={() => setSimulation(null)}
              className="px-8 py-3 rounded-full border border-outline text-on-surface
                         hover:bg-surface-container transition-colors"
            >
              Discard
            </button>

          </div>

        </div>
      )}
    </div>
  )
}