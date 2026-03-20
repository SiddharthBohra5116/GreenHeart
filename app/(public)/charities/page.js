import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function Charities() {
  const { data: charities } = await supabaseAdmin
    .from('charities')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#f0ece0]">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[#1a4a2e]">
        <Link href="/" className="font-playfair text-2xl tracking-widest text-[#c9a84c]">
          GREEN<span className="text-[#f0ece0]">HEART</span>
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/login"
            className="text-sm text-[#7a9e7e] hover:text-[#f0ece0] transition-colors">
            Login
          </Link>
          <Link href="/signup"
            className="bg-[#c9a84c] text-[#0a0f0a] px-5 py-2 text-sm font-bold
                       tracking-widest uppercase hover:bg-[#b8943d] transition-colors">
            Join Now
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-[#0f2d1a] px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#c9a84c] text-xs font-bold tracking-[4px] uppercase mb-4">
            Supporting Good Causes
          </p>
          <h1 className="font-playfair text-6xl lg:text-7xl mb-4">Our Charities</h1>
          <div className="w-16 h-0.5 bg-[#c9a84c] mb-6"></div>
          <p className="text-[#4a5a4e] max-w-xl leading-relaxed">
            Every GreenHeart subscription donates at least 10% to a charity of your choice.
            Explore the causes below and find the one closest to your heart.
          </p>
        </div>
      </div>

      {/* Charities Grid */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charities?.map((c) => (
            <div key={c.id}
              className="border border-[#1a4a2e] p-8 hover:border-[#c9a84c]
                         transition-colors group">
              <div className="text-xs text-[#7a9e7e] uppercase tracking-wider mb-2 capitalize">
                {c.category}
              </div>
              <h3 className="font-playfair text-2xl mb-3 group-hover:text-[#c9a84c] transition-colors">
                {c.name}
              </h3>
              <p className="text-[#4a5a4e] text-sm leading-relaxed mb-6">
                {c.description}
              </p>
              <div className="pt-4 border-t border-[#1a4a2e]">
                <div className="text-xs text-[#c9a84c] font-bold uppercase tracking-wider">
                  Active Cause
                </div>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {(!charities || charities.length === 0) && (
            <div className="col-span-3 text-center py-20 text-[#4a5a4e]">
              <p className="font-playfair text-2xl mb-2">No charities yet</p>
              <p className="text-sm">Check back soon.</p>
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <Link href="/signup"
            className="bg-[#c9a84c] text-[#0a0f0a] px-10 py-4 font-bold
                       tracking-widest uppercase text-sm hover:bg-[#b8943d] transition-colors">
            Join & Choose Your Cause →
          </Link>
        </div>
      </div>
    </div>
  )
}