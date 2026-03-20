import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-emerald-50 rounded-t-[2rem] mt-32">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-12 py-16
                      max-w-7xl mx-auto text-sm font-medium text-emerald-900">
        <div className="space-y-6">
          <div className="text-xl font-extrabold text-emerald-900 font-headline">
            GreenHeart
          </div>
          <p className="text-emerald-800/60 leading-relaxed">
            Elevating corporate and private philanthropy through the
            world's most elegant sport.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h5 className="font-bold text-emerald-900 uppercase
                         tracking-widest text-xs">
            Explore
          </h5>
          {[
            { label: 'Charities', href: '/charities' },
            { label: 'Pricing',   href: '/pricing' },
            { label: 'Login',     href: '/login' },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="text-emerald-800/60 hover:text-emerald-900
                         transition-colors">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <h5 className="font-bold text-emerald-900 uppercase
                         tracking-widest text-xs">
            Platform
          </h5>
          {[
            { label: 'Sign Up',    href: '/signup' },
            { label: 'Dashboard',  href: '/dashboard' },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="text-emerald-800/60 hover:text-emerald-900
                         transition-colors">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          <h5 className="font-bold text-emerald-900 uppercase
                         tracking-widest text-xs">
            Newsletter
          </h5>
          <div className="flex items-center bg-white rounded-full
                          p-1.5 shadow-sm">
            <input
              className="bg-transparent border-none focus:ring-0 px-4 w-full
                         text-emerald-900 placeholder:text-emerald-900/40
                         outline-none"
              placeholder="Email Address"
              type="email"
            />
            <button className="w-10 h-10 rounded-full signature-gradient
                               flex items-center justify-center text-white
                               shrink-0 shadow-lg">
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-12 pb-8 flex flex-col md:flex-row
                      justify-between items-center text-emerald-800/40 text-xs">
        <p>© 2026 GreenHeart. Built for Digital Heroes Selection Process.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  )
}