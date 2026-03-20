'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    // Quick check — try fetching a lightweight auth endpoint
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user) setUser(data.user)
      })
      .catch(() => {})
      .finally(() => setChecked(true))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.replace('/login')
  }

  return (
    <nav className="fixed top-0 z-50 flex items-center justify-between
                    px-8 py-3 bg-white/60 backdrop-blur-xl rounded-full
                    mt-4 w-[95%] max-w-7xl border border-white/40
                    shadow-xl shadow-emerald-900/5"
         style={{left: '50%', transform: 'translateX(-50%)'}}>

      <Link href="/"
        className="text-2xl font-extrabold text-emerald-950 font-headline
                   tracking-tight">
        GreenHeart
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link href="/"
          className="text-emerald-900/70 font-medium hover:text-emerald-600
                     transition-all text-sm">
          Home
        </Link>
        <Link href="/charities"
          className="text-emerald-900/70 font-medium hover:text-emerald-600
                     transition-all text-sm">
          Charities
        </Link>
        <Link href="/pricing"
          className="text-emerald-900/70 font-medium hover:text-emerald-600
                     transition-all text-sm">
          Pricing
        </Link>

        {/* Show Login only when NOT logged in */}
        {checked && !user && (
          <Link href="/login"
            className="text-emerald-900/70 font-medium hover:text-emerald-600
                       transition-all text-sm">
            Login
          </Link>
        )}

        {/* Show Dashboard + Logout when logged in */}
        {checked && user && (
          <>
            <Link
              href={user.role === 'admin' ? '/admin' : '/dashboard'}
              className="text-emerald-900/70 font-medium hover:text-emerald-600
                         transition-all text-sm">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-emerald-900/70 font-medium hover:text-red-500
                         transition-all text-sm">
              Logout
            </button>
          </>
        )}
      </div>

      {/* Right CTA — Join if not logged in, Dashboard if logged in */}
      {checked && !user && (
        <Link href="/signup"
          className="signature-gradient text-white px-6 py-2.5
                     rounded-full font-bold hover:scale-105 active:scale-95
                     duration-300 shadow-lg shadow-emerald-900/20">
          Join the Movement
        </Link>
      )}
      {checked && user && (
        <Link
          href={user.role === 'admin' ? '/admin' : '/dashboard'}
          className="signature-gradient text-white px-6 py-2.5
                     rounded-full font-bold hover:scale-105 active:scale-95
                     duration-300 shadow-lg shadow-emerald-900/20">
          My Dashboard
        </Link>
      )}
    </nav>
  )
}