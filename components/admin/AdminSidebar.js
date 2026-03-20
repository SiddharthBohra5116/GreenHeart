// components/admin/AdminSidebar.js
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin',           icon: 'dashboard',           label: 'Overview'  },
  { href: '/admin/users',     icon: 'group',               label: 'Users'     },
  { href: '/admin/draw',      icon: 'confirmation_number', label: 'Draw'      },
  { href: '/admin/charities', icon: 'volunteer_activism',  label: 'Charities' },
  { href: '/admin/winners',   icon: 'emoji_events',        label: 'Winners'   },
  { href: '/admin/reports',   icon: 'bar_chart',           label: 'Reports'   },
]

export default function AdminSidebar({ adminName }) {
  const path = usePathname()

  const initials = adminName
    ? adminName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD'

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.replace('/login')
  }

  return (
    <aside className="h-screen w-64 fixed left-0 top-0
                      bg-[#002e0b] flex flex-col py-8
                      shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-50">

      {/* Logo */}
      <div className="px-8 mb-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-white
                       font-headline">
          GreenHeart
        </h1>
        <p className="text-white/40 text-xs uppercase tracking-widest mt-1
                      font-medium">
          Admin Panel
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const isActive = path === item.href
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-5 py-3 rounded-full
                          transition-all duration-200 ${
                isActive
                  ? 'bg-white/15 text-[#6bfe9c] font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5 font-medium'
              }`}>
              <span className="material-symbols-outlined text-xl"
                style={isActive
                  ? { fontVariationSettings: "'FILL' 1" }
                  : {}}>
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Profile + Logout */}
      <div className="px-5 mt-6 space-y-3">

        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-3
                        bg-white/5 rounded-[1rem]">
          <div className="w-9 h-9 rounded-full flex items-center justify-center
                          text-white text-xs font-bold flex-shrink-0"
            style={{background:'linear-gradient(135deg,#006d37,#0b4619)'}}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {adminName || 'Admin'}
            </p>
            <p className="text-xs text-white/40">Global Admin</p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-3 rounded-full
                     text-white/60 hover:text-red-400 hover:bg-red-500/10
                     transition-all duration-200 text-sm font-medium">
          <span className="material-symbols-outlined text-xl">logout</span>
          Logout
        </button>

      </div>
    </aside>
  )
}