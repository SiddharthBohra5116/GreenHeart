'use client'

import { useState } from 'react'
import Link from 'next/link'
import AuthLeftPanel from '@/components/auth/AuthLeftPanel'

export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()

      console.log('Login response:', data)

      if (res.ok && data.user) {
        if (data.user.role === 'admin') {
          window.location.replace('/admin')
        } else {
          window.location.replace('/dashboard')
        }
      } else {
        setError(data.error || 'Login failed')
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
        title="Welcome back to GreenHeart."
        subtitle='"Every round you play funds a better world."'
        benefits={[]}
      />

      {/* Right Panel */}
      <section className="w-full md:w-1/2 bg-[#f8faf9] flex items-center
                          justify-center p-6 md:p-12 lg:p-24">
        <div className="w-full max-w-md">

          <div className="mb-10">
            <h2 className="font-headline text-3xl text-[#002e0b] mb-2">
              Sign in
            </h2>
            <p className="text-[#424940]">
              Continue your journey toward sustainable impact.
            </p>
          </div>

          {/* Demo credentials box */}
          <div className="bg-[#f2f4f3] rounded-xl p-4 mb-8 border
                          border-[#c1c9bd]/40">
            <p className="text-xs font-bold text-[#006d37] uppercase
                           tracking-wider mb-2">
              Demo Credentials
            </p>
            <p className="text-xs text-[#424940]">
              User: user@demo.com / demo123
            </p>
            <p className="text-xs text-[#424940]">
              Admin: admin@demo.com / Admin@123
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">

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
              <label className="block text-sm font-medium text-[#191c1c] ml-1"
                htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && (
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              )}
            </button>

          </form>

          <div className="mt-10 text-center">
            <p className="text-[#424940]">
              Don't have an account?{' '}
              <Link href="/signup"
                className="text-[#006d37] font-bold hover:underline ml-1">
                Create one
              </Link>
            </p>
          </div>

        </div>
      </section>
    </main>
  )
}
