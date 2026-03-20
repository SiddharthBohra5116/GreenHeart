'use client'

import { useState } from 'react'
import Link from 'next/link'
import AuthLeftPanel from '@/components/auth/AuthLeftPanel'

const BENEFITS = [
  { icon: 'redeem',           label: 'Monthly prize draws' },
  { icon: 'volunteer_activism', label: 'Direct charity impact' },
  { icon: 'analytics',        label: 'Score tracking' },
  { icon: 'verified_user',    label: 'Winner verification' },
]

export default function Signup() {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/signup', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password }),
      })
      const data = await res.json()

      if (res.ok) {
        window.location.href = '/login'
      } else {
        setError(data.error || 'Signup failed')
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

          <div className="mb-10">
            <h2 className="font-headline text-3xl text-[#002e0b] mb-2">
              Create your account
            </h2>
            <p className="text-[#424940]">
              Start your journey toward sustainable impact.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">

            {/* Name */}
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
                className="w-full bg-[#f2f4f3] border-none rounded-xl px-5 py-4
                           text-[#191c1c] placeholder:text-[#72796f] outline-none
                           focus:ring-2 focus:ring-[#006d37]/30 transition-all"
              />
            </div>

            {/* Email */}
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
                className="w-full bg-[#f2f4f3] border-none rounded-xl px-5 py-4
                           text-[#191c1c] placeholder:text-[#72796f] outline-none
                           focus:ring-2 focus:ring-[#006d37]/30 transition-all"
              />
            </div>

            {/* Password */}
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
                className="w-full bg-[#f2f4f3] border-none rounded-xl px-5 py-4
                           text-[#191c1c] placeholder:text-[#72796f] outline-none
                           focus:ring-2 focus:ring-[#006d37]/30 transition-all"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700
                              px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-label font-bold py-5 rounded-full
                         shadow-lg hover:scale-[1.02] active:scale-[0.98]
                         transition-all flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
              style={{background: 'linear-gradient(135deg, #002e0b 0%, #0b4619 100%)'}}>
              {loading ? 'Creating Account...' : 'Create Account'}
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

        </div>
      </section>
    </main>
  )
}