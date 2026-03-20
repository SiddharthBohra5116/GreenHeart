'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin',            icon: 'dashboard',            label: 'Overview' },
  { href: '/admin/users',      icon: 'group',                label: 'Users' },
  { href: '/admin/draw',       icon: 'confirmation_number',  label: 'Draw' },
  { href: '/admin/charities',  icon: 'volunteer_activism',   label: 'Charities' },
  { href: '/admin/winners',    icon: 'emoji_events',         label: 'Winners' },
]

export default function AdminSidebar({ adminName }) {
  const path = usePathname()

  const initials = adminName
    ? adminName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD'

  return (
    <aside className="h-screen w-72 fixed left-0 top-0 rounded-r-[3rem]
                      bg-primary/90 backdrop-blur-xl flex flex-col py-8
                      shadow-[20px_0_40px_rgba(25,28,28,0.06)] z-50">

      {/* Header */}
      <div className="px-8 mb-10">
        <h1 className="text-2xl font-extrabold tracking-tighter text-white font-headline">
          Conservatory
        </h1>
        <p className="text-white/60 font-medium text-xs uppercase tracking-widest mt-1">
          Admin Suite
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {NAV.map((item) => {
          const isActive = path === item.href

          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-4 px-6 py-4 mx-2 rounded-full
                          transition-all duration-200 group ${
                isActive
                  ? 'bg-white/10 text-secondary scale-[1.02]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}>

              <span className="material-symbols-outlined"
                style={isActive
                  ? { fontVariationSettings: "'FILL' 1" }
                  : {}}>
                {item.icon}
              </span>

              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom CTA */}
      <div className="px-6 mt-auto">
        <button className="w-full py-4 soulful-gradient text-white
                           rounded-full font-medium shadow-lg
                           hover:scale-[1.02] transition-transform active:scale-95">
          Create New Draw
        </button>
      </div>

      {/* Profile */}
      <div className="px-6 mt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center
                          text-white text-sm font-bold soulful-gradient">
            {initials}
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              {adminName || 'Admin'}
            </p>
            <p className="text-xs text-white/60">Global Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}