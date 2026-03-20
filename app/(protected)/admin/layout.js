import Link from 'next/link'
import { getUserProfile } from '@/lib/getUserProfile'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }) {
  const user = await getUserProfile()
  if (!user) redirect('/login')
  if (user.role !== 'admin') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#f0ece0] flex">

      {/* Sidebar */}
      <aside className="w-56 bg-[#0a0f0a] border-r border-[#1a4a2e] flex flex-col fixed h-full">
        <div className="p-6 border-b border-[#1a4a2e]">
          <div className="font-playfair text-xl text-[#c9a84c]">
            GREEN<span className="text-[#f0ece0]">HEART</span>
          </div>
          <div className="text-xs text-[#4a5a4e] mt-1 uppercase tracking-wider">Admin Panel</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: '/admin', label: '📊 Overview' },
            { href: '/admin/users', label: '👥 Users' },
            { href: '/admin/draw', label: '🎲 Draw' },
            { href: '/admin/charities', label: '❤️ Charities' },
            { href: '/admin/winners', label: '🏆 Winners' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 text-sm text-[#7a9e7e] hover:text-[#f0ece0]
                         hover:bg-[#0f2d1a] border border-transparent
                         hover:border-[#1a4a2e] transition-all"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1a4a2e]">
          <Link
            href="/api/auth/logout"
            className="block px-4 py-3 text-sm text-[#4a5a4e] hover:text-red-400
                       transition-colors text-center"
          >
            🚪 Logout
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-56 flex-1 p-8">
        {children}
      </main>
    </div>
  )
}