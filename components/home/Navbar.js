import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center
                    justify-between px-8 py-3 bg-white/60 backdrop-blur-xl
                    rounded-full mt-4 mx-auto w-[95%] max-w-7xl
                    border border-white/40 shadow-xl shadow-emerald-900/5"
         style={{left: '50%', transform: 'translateX(-50%)'}}>
      <Link href="/"
        className="text-2xl font-extrabold text-emerald-950 font-headline tracking-tight">
        GreenHeart
      </Link>
      <div className="hidden md:flex items-center gap-8">
        {[
          { label: 'Home',      href: '/' },
          { label: 'Charities', href: '/charities' },
          { label: 'Pricing',   href: '/pricing' },
          { label: 'Login',     href: '/login' },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className="text-emerald-900/70 font-medium hover:text-emerald-600
                       transition-all text-sm">
            {item.label}
          </Link>
        ))}
      </div>
      <Link href="/signup"
        className="signature-gradient text-white font-label px-6 py-2.5
                   rounded-full font-bold hover:scale-105 active:scale-95
                   duration-300 shadow-lg shadow-emerald-900/20">
        Join the Movement
      </Link>
    </nav>
  )
}