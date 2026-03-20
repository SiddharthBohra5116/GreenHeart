// app/(public)/signup/page.js
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AuthLeftPanel from '@/components/auth/AuthLeftPanel'

const BENEFITS = [
  { icon: 'redeem',             label: 'Monthly prize draws'   },
  { icon: 'volunteer_activism', label: 'Direct charity impact' },
  { icon: 'analytics',          label: 'Score tracking'        },
  { icon: 'verified_user',      label: 'Winner verification'   },
]

const CATEGORY_COLORS = {
  Environment: { bg: '#9bf6b2', text: '#00210c' },
  Youth:       { bg: '#6bfe9c', text: '#00210c' },
  Health:      { bg: '#c8e6c9', text: '#1b5e20' },
  Community:   { bg: '#b2dfdb', text: '#004d40' },
  Sport:       { bg: '#dcedc8', text: '#33691e' },
  Education:   { bg: '#fff9c4', text: '#f57f17' },
}
const DEFAULT_COLOR = { bg: '#eceeed', text: '#424940' }

export default function Signup() {
  // Step 1 = account details, Step 2 = charity selection
  const [step,      setStep]      = useState(1)
  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [charities, setCharities] = useState([])
  const [selected,  setSelected]  = useState(null)
  const [charLoading, setCharLoading] = useState(false)

  // Fetch charities when reaching step 2
  useEffect(() => {
    if (step !== 2) return
    setCharLoading(true)
    fetch('/api/charities')
      .then(r => r.json())
      .then(d => setCharities(d.charities || []))
      .catch(() => setCharities([]))
      .finally(() => setCharLoading(false))
  }, [step])

  // ── Step 1: Create account ─────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res  = await fetch('/api/auth/signup', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password }),
      })
      const data = await res.json()

      if (res.ok) {
        // Move to charity selection step
        setStep(2)
      } else {
        setError(data.error || 'Signup failed')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: Login and save charity selection ───────────────────
  const handleCharityStep = async (skip = false) => {
    setLoading(true)
    setError('')

    try {
      // First: log the user in so we have a session
      const loginRes = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const loginData = await loginRes.json()

      if (!loginRes.ok) {
        setError(loginData.error || 'Login after signup failed. Please log in manually.')
        setLoading(false)
        return
      }

      // Save charity if one was selected
      if (!skip && selected) {
        await fetch('/api/update-charity', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ charityId: selected, percentage: 10 }),
        })
      }

      // Redirect based on role
      if (loginData.user?.role === 'admin') {
        window.location.replace('/admin')
      } else {
        window.location.replace('/dashboard')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden
                     bg-[#f8faf9]">

      <AuthLeftPanel
        title="Join a movement of purposeful players."
        subtitle='"Elevating the game to change the world, one heartbeat at a time."'
        benefits={BENEFITS}
      />

      {/* Right Panel */}
      <section className="w-full md:w-1/2 bg-[#f8faf9] flex items-center
                          justify-center p-6 md:p-12 lg:p-24">
        <div className="w-full max-w-md">

          {/* ── STEP INDICATOR ── */}
          <div className="flex items-center gap-3 mb-10">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center
                                 justify-center text-xs font-bold transition-all ${
                  step >= s
                    ? 'text-white'
                    : 'bg-[#e1e3e2] text-[#424940]'
                }`}
                  style={step >= s
                    ? { background: 'linear-gradient(135deg,#002e0b,#0b4619)' }
                    : {}}>
                  {step > s
                    ? <span className="material-symbols-outlined text-sm">check</span>
                    : s}
                </div>
                <span className={`text-xs font-medium ${
                  step >= s ? 'text-[#002e0b]' : 'text-[#72796f]'
                }`}>
                  {s === 1 ? 'Account' : 'Charity'}
                </span>
                {s < 2 && (
                  <div className={`w-8 h-0.5 rounded-full ${
                    step > s ? 'bg-[#006d37]' : 'bg-[#c1c9bd]'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* ── STEP 1: Account Details ── */}
          {step === 1 && (
            <>
              <div className="mb-10">
                <h2 className="font-headline text-3xl text-[#002e0b] mb-2">
                  Create your account
                </h2>
                <p className="text-[#424940]">
                  Start your journey toward sustainable impact.
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-6">

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#191c1c] ml-1"
                    htmlFor="fullname">
                    Full Name
                  </label>
                  <input
                    id="fullname"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#f2f4f3] border-none rounded-xl
                               px-5 py-4 text-[#191c1c] placeholder:text-[#72796f]
                               outline-none focus:ring-2 focus:ring-[#006d37]/30
                               transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#191c1c] ml-1"
                    htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#f2f4f3] border-none rounded-xl
                               px-5 py-4 text-[#191c1c] placeholder:text-[#72796f]
                               outline-none focus:ring-2 focus:ring-[#006d37]/30
                               transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-[#191c1c] ml-1"
                      htmlFor="password">
                      Password
                    </label>
                    <span className="text-xs text-[#424940]">Min. 6 characters</span>
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-[#f2f4f3] border-none rounded-xl
                               px-5 py-4 text-[#191c1c] placeholder:text-[#72796f]
                               outline-none focus:ring-2 focus:ring-[#006d37]/30
                               transition-all"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700
                                  px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white font-bold py-5 rounded-full
                             shadow-lg hover:scale-[1.02] active:scale-[0.98]
                             transition-all flex items-center justify-center
                             gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{background:'linear-gradient(135deg,#002e0b 0%,#0b4619 100%)'}}>
                  {loading ? 'Creating Account...' : 'Continue'}
                  {!loading && (
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  )}
                </button>
              </form>

              <div className="mt-10 text-center">
                <p className="text-[#424940]">
                  Already a member?{' '}
                  <Link href="/login"
                    className="text-[#006d37] font-bold hover:underline ml-1">
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}

          {/* ── STEP 2: Charity Selection ── */}
          {step === 2 && (
            <>
              <div className="mb-8">
                <h2 className="font-headline text-3xl text-[#002e0b] mb-2">
                  Choose your cause
                </h2>
                <p className="text-[#424940] text-sm leading-relaxed">
                  At least 10% of your subscription goes directly to your chosen charity.
                  You can change this anytime from your dashboard.
                </p>
              </div>

              {charLoading ? (
                <div className="flex items-center justify-center py-12">
                  <span className="w-8 h-8 border-2 border-[#006d37]/30
                                   border-t-[#006d37] rounded-full animate-spin" />
                </div>
              ) : charities.length === 0 ? (
                <div className="text-center py-8 bg-[#f2f4f3] rounded-[1.5rem] mb-6">
                  <span className="material-symbols-outlined text-3xl
                                   text-[#c1c9bd] block mb-2">
                    volunteer_activism
                  </span>
                  <p className="text-[#424940] text-sm">
                    No charities available yet. You can select one from your dashboard.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-1">
                  {charities.map((c) => {
                    const colors = CATEGORY_COLORS[c.category] || DEFAULT_COLOR
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelected(c.id)}
                        className={`w-full px-4 py-4 rounded-[1rem] text-left
                                    transition-all border-2 ${
                          selected === c.id
                            ? 'border-[#006d37] bg-[#006d37]/5'
                            : 'border-transparent bg-[#f2f4f3] hover:bg-[#eceeed]'
                        }`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-sm text-[#002e0b]">
                              {c.name}
                            </span>
                            {c.category && (
                              <span
                                className="px-2 py-0.5 rounded-full text-[10px]
                                           font-bold uppercase"
                                style={{
                                  backgroundColor: colors.bg,
                                  color:           colors.text,
                                }}>
                                {c.category}
                              </span>
                            )}
                          </div>
                          {selected === c.id && (
                            <span
                              className="material-symbols-outlined text-[#006d37] text-lg"
                              style={{ fontVariationSettings: "'FILL' 1" }}>
                              check_circle
                            </span>
                          )}
                        </div>
                        {c.description && (
                          <p className="text-xs text-[#424940] mt-1 line-clamp-1">
                            {c.description}
                          </p>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700
                                px-4 py-3 rounded-xl text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => handleCharityStep(false)}
                  disabled={loading || (!selected && charities.length > 0)}
                  className="w-full text-white font-bold py-5 rounded-full
                             shadow-lg hover:scale-[1.02] active:scale-[0.98]
                             transition-all flex items-center justify-center
                             gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{background:'linear-gradient(135deg,#002e0b 0%,#0b4619 100%)'}}>
                  {loading ? 'Setting up...' : 'Confirm & Go to Dashboard'}
                  {!loading && (
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleCharityStep(true)}
                  disabled={loading}
                  className="w-full py-3 text-sm text-[#424940] hover:text-[#191c1c]
                             font-medium transition-colors">
                  Skip for now — I'll choose later
                </button>
              </div>
            </>
          )}

        </div>
      </section>
    </main>
  )
}