'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      console.log('Login response status:', res.status)
      console.log('Login response data:', data)

      if (res.ok && data.user) {
        if (data.user.role === 'admin') {
          window.location.replace('/admin')
        } else {
          window.location.replace('/dashboard')
        }
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f0a] grid grid-cols-1 lg:grid-cols-2">

      {/* Left panel */}
      <div className="hidden lg:flex bg-[#0f2d1a] flex-col justify-center px-16
                      relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{backgroundImage: 'radial-gradient(circle at 70% 50%, #c9a84c, transparent 60%)'}}>
        </div>
        <div className="relative z-10">
          <Link href="/"
            className="font-playfair text-3xl tracking-widest text-[#c9a84c] mb-16 block">
            GREEN<span className="text-[#f0ece0]">HEART</span>
          </Link>
          <h2 className="font-playfair text-5xl leading-tight mb-6 text-[#f0ece0]">
            Welcome<br/>
            <span className="text-[#c9a84c] italic">back.</span>
          </h2>
          <p className="text-[#4a5a4e] leading-relaxed max-w-sm">
            Track scores, view draw results, and see your charity impact —
            all from your personal dashboard.
          </p>
          <div className="mt-12 p-6 border border-[#1a4a2e]">
            <div className="text-xs text-[#c9a84c] font-bold tracking-widest uppercase mb-3">
              Demo Credentials
            </div>
            <div className="text-sm text-[#4a5a4e] space-y-1">
              <div>User: user@demo.com / demo123</div>
              <div>Admin: admin@demo.com / admin123</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col justify-center px-8 lg:px-16 py-20">
        <div className="max-w-md w-full mx-auto">

          <Link href="/"
            className="font-playfair text-2xl tracking-widest text-[#c9a84c] mb-12 block lg:hidden">
            GREEN<span className="text-[#f0ece0]">HEART</span>
          </Link>

          <p className="text-[#7a9e7e] text-xs tracking-[3px] uppercase mb-3">
            Welcome Back
          </p>
          <h1 className="font-playfair text-5xl mb-2 text-[#f0ece0]">Sign In</h1>
          <div className="w-10 h-0.5 bg-[#c9a84c] mb-10"></div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase
                                text-[#4a5a4e] mb-3">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0f2d1a] border border-[#1a4a2e] text-[#f0ece0]
                           px-4 py-4 outline-none focus:border-[#c9a84c] transition-colors
                           placeholder:text-[#2a3a2e]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase
                                text-[#4a5a4e] mb-3">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0f2d1a] border border-[#1a4a2e] text-[#f0ece0]
                           px-4 py-4 outline-none focus:border-[#c9a84c] transition-colors
                           placeholder:text-[#2a3a2e]"
              />
            </div>

            {error && (
              <div className="border border-red-900 bg-red-900/20 px-4 py-3
                              text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a84c] text-[#0a0f0a] py-4 font-bold tracking-widest
                         uppercase text-sm hover:bg-[#b8943d] transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Login →'}
            </button>
          </form>

          <p className="mt-8 text-sm text-[#4a5a4e]">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#c9a84c] hover:underline">
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}