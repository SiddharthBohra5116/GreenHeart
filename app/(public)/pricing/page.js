'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Pricing() {
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')

  const handleSubscribe = async (plan) => {
    setLoading(plan)
    setError('')

    try {
      const res = await fetch('/api/subscription/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      if (res.ok) {
        window.location.href = '/dashboard'
      } else {
        const data = await res.json()
        setError(data.error || 'Subscription failed. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#f0ece0]">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[#1a4a2e]">
        <Link href="/" className="font-playfair text-2xl tracking-widest text-[#c9a84c]">
          GREEN<span className="text-[#f0ece0]">HEART</span>
        </Link>
        <Link href="/login" className="text-sm text-[#7a9e7e] hover:text-[#f0ece0] transition-colors">
          Already a member? Login →
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <p className="text-[#c9a84c] text-xs font-bold tracking-[4px] uppercase mb-4">
            Simple Pricing
          </p>
          <h1 className="font-playfair text-6xl mb-4">Choose Your Plan</h1>
          <div className="w-16 h-0.5 bg-[#c9a84c] mx-auto mb-6"></div>
          <p className="text-[#4a5a4e] max-w-md mx-auto">
            All plans include full platform access, monthly draws, and charity contributions.
          </p>
        </div>

        {error && (
          <div className="border border-red-900 bg-red-900/20 px-6 py-4 text-red-400 text-sm
                          text-center mb-8 max-w-md mx-auto">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">

          {/* Monthly */}
          <div className="border border-[#1a4a2e] p-10 flex flex-col hover:border-[#c9a84c]
                          transition-colors group">
            <p className="text-xs text-[#7a9e7e] uppercase tracking-widest mb-4">Monthly Plan</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-playfair text-6xl text-[#f0ece0]">£9</span>
              <span className="font-playfair text-3xl text-[#c9a84c]">.99</span>
            </div>
            <p className="text-[#4a5a4e] text-sm mb-8">per month · cancel anytime</p>

            <ul className="space-y-3 mb-10 flex-grow">
              {[
                'Full platform access',
                'Monthly draw entry',
                '5-score rolling tracker',
                'Charity contribution (10%+)',
                'Winner verification system',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#7a9e7e]">
                  <span className="text-[#c9a84c]">✓</span> {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={!!loading}
              className="w-full border border-[#c9a84c] text-[#c9a84c] py-4 font-bold
                         tracking-widest uppercase text-sm hover:bg-[#c9a84c] hover:text-[#0a0f0a]
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'monthly' ? 'Processing...' : 'Subscribe Monthly'}
            </button>
          </div>

          {/* Yearly */}
          <div className="border-2 border-[#c9a84c] p-10 flex flex-col relative bg-[#0f2d1a]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#c9a84c]
                            text-[#0a0f0a] text-xs font-bold px-6 py-1.5 tracking-widest uppercase">
              Best Value
            </div>
            <p className="text-xs text-[#c9a84c] uppercase tracking-widest mb-4">Yearly Plan</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-playfair text-6xl text-[#f0ece0]">£99</span>
            </div>
            <p className="text-[#4a5a4e] text-sm mb-8">per year · save £20.88</p>

            <ul className="space-y-3 mb-10 flex-grow">
              {[
                'Full platform access',
                '12 draw entries guaranteed',
                '5-score rolling tracker',
                'Charity contribution (10%+)',
                'Winner verification system',
                'Discounted rate',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#7a9e7e]">
                  <span className="text-[#c9a84c]">✓</span> {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('yearly')}
              disabled={!!loading}
              className="w-full bg-[#c9a84c] text-[#0a0f0a] py-4 font-bold tracking-widest
                         uppercase text-sm hover:bg-[#b8943d] transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'yearly' ? 'Processing...' : 'Subscribe Yearly →'}
            </button>
          </div>
        </div>

        <p className="text-center text-[#2a3a2e] text-xs mt-10">
          🔒 No real payment processed · Demo activation only · Cancel anytime
        </p>
      </div>
    </div>
  )
}