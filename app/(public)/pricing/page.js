'use client'

import { useState } from 'react'
import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'

const MONTHLY_FEATURES = [
  'Full platform access',
  'Monthly draw entry',
  '5-score rolling tracker',
  'Charity contribution (10%+)',
  'Winner verification system',
]

const YEARLY_FEATURES = [
  'Everything in Monthly',
  '2 Months Free — Save £20.88',
  '12 guaranteed draw entries',
  'Priority support',
  'Discounted rate per month',
  'Cancel anytime',
]

const TRUST = [
  {
    icon: 'verified_user',
    title: 'Secure & Private',
    desc: 'Your data is protected with bank-grade encryption.',
  },
  {
    icon: 'published_with_changes',
    title: 'Cancel Anytime',
    desc: 'No lock-in contracts. Stay as long as you want.',
  },
  {
    icon: 'volunteer_activism',
    title: 'Real Charity Impact',
    desc: 'At least 10% of every subscription goes to your chosen cause.',
  },
]

export default function Pricing() {
  const [loading, setLoading] = useState(null)
  const [error,   setError]   = useState('')

  const handleSubscribe = async (plan) => {
    setLoading(plan)
    setError('')

    try {
      const res = await fetch('/api/subscription/activate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ plan }),
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
    <div className="min-h-screen bg-[#f8faf9] font-body text-[#191c1c]">
      <Navbar />

      <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto
                       flex flex-col items-center">

        {/* Header */}
        <header className="text-center mb-16 max-w-2xl">
          <span className="inline-block py-1 px-4 bg-[#9bf6b2] text-emerald-900
                           text-xs font-bold tracking-widest rounded-full mb-6
                           uppercase">
            MEMBERSHIP
          </span>
          <h1 className="font-headline text-5xl md:text-6xl text-[#002e0b]
                         font-extrabold tracking-tight mb-6">
            Choose Your Impact Level
          </h1>
          <p className="text-[#424940] text-lg leading-relaxed">
            Subscribe monthly or yearly. Support a charity you care about.
            Enter monthly draws. All in one platform.
          </p>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700
                          px-6 py-4 rounded-xl text-sm max-w-md text-center">
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full
                        max-w-5xl items-stretch">

          {/* Monthly */}
          <div className="glass-panel rounded-[2rem] p-10 flex flex-col
                          justify-between hover:scale-[1.01]
                          transition-transform duration-500">
            <div>
              <span className="text-[#424940] text-sm font-bold uppercase
                               tracking-wider">
                Monthly Plan
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-headline font-extrabold
                                 text-[#002e0b]">
                  £9.99
                </span>
                <span className="text-[#424940] font-medium">/mo</span>
              </div>
              <p className="mt-4 text-[#424940] leading-relaxed text-sm">
                Full access to scores, draws, and charity giving.
                Cancel anytime.
              </p>
              <ul className="mt-10 space-y-4">
                {MONTHLY_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#006d37]"
                      style={{fontVariationSettings:"'FILL' 1"}}>
                      check_circle
                    </span>
                    <span className="text-[#191c1c] font-medium text-sm">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={!!loading}
              className="mt-12 w-full py-4 rounded-full border-2
                         border-[#002e0b] text-[#002e0b] font-bold
                         hover:bg-[#002e0b] hover:text-white
                         transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed">
              {loading === 'monthly' ? 'Processing...' : 'Start Monthly'}
            </button>
          </div>

          {/* Yearly */}
          <div className="rounded-[2rem] p-10 flex flex-col justify-between
                          relative overflow-hidden shadow-2xl
                          shadow-emerald-950/20 hover:scale-[1.01]
                          transition-transform duration-500"
            style={{background:'linear-gradient(135deg,#002e0b 0%,#0b4619 100%)'}}>

            <div className="absolute -top-24 -right-24 w-64 h-64
                            bg-white/10 rounded-full blur-3xl
                            pointer-events-none" />

            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <span className="text-emerald-200 text-sm font-bold
                                 uppercase tracking-wider">
                  Annual Plan
                </span>
                <span className="bg-[#6bfe9c] text-emerald-950 text-[10px]
                                 font-black tracking-widest px-3 py-1
                                 rounded-full">
                  BEST VALUE
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-headline font-extrabold
                                 text-white">
                  £99
                </span>
                <span className="text-emerald-200 font-medium">/yr</span>
              </div>
              <p className="mt-4 text-emerald-100/80 leading-relaxed text-sm">
                Best value — equivalent to £8.25/month. Two months free
                compared to monthly billing.
              </p>
              <ul className="mt-10 space-y-4">
                {YEARLY_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#6bfe9c]"
                      style={{fontVariationSettings:"'FILL' 1"}}>
                      check_circle
                    </span>
                    <span className="text-white font-medium text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe('yearly')}
              disabled={!!loading}
              className="mt-12 w-full py-4 rounded-full bg-white
                         text-emerald-950 font-extrabold hover:bg-emerald-50
                         transition-all duration-300 shadow-xl relative z-10
                         disabled:opacity-50 disabled:cursor-not-allowed">
              {loading === 'yearly' ? 'Processing...' : 'Start Your Legacy'}
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-xs text-[#424940]/60 text-center">
          No real payment processed · Demo activation only · Cancel anytime
        </p>

        {/* Trust */}
        <section className="mt-24 w-full grid grid-cols-1 md:grid-cols-3
                            gap-12 text-center border-t border-[#c1c9bd]/20
                            pt-16">
          {TRUST.map((t) => (
            <div key={t.title} className="flex flex-col items-center">
              <span className="material-symbols-outlined text-[#006d37]
                               text-4xl mb-4">
                {t.icon}
              </span>
              <h4 className="font-headline font-extrabold text-[#002e0b] mb-2">
                {t.title}
              </h4>
              <p className="text-[#424940] text-sm leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </section>

      </main>

      <Footer />
    </div>
  )
}