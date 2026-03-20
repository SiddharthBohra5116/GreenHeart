import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'

const CATEGORY_COLORS = {
  Environment: { bg: '#9bf6b2', text: '#00210c' },
  Youth:       { bg: '#6bfe9c', text: '#00210c' },
  Health:      { bg: '#c8e6c9', text: '#1b5e20' },
  Community:   { bg: '#b2dfdb', text: '#004d40' },
  Sport:       { bg: '#dcedc8', text: '#33691e' },
  Education:   { bg: '#fff9c4', text: '#f57f17' },
}
const DEFAULT_COLOR = { bg: '#9bf6b2', text: '#00210c' }
const FALLBACK_IMG  = 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800'

function formatINR(amount) {
  if (amount >= 100000) return `\u20b9${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000)   return `\u20b9${(amount / 1000).toFixed(1)}k`
  return `\u20b9${amount.toFixed(0)}`
}

export default async function CharityProfile({ params }) {
  const { id } = await params

  const { data: charity, error } = await supabaseAdmin
    .from('charities')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle()

  if (error || !charity) notFound()

  const { data: donations } = await supabaseAdmin
    .from('donations').select('amount').eq('charity_id', id)

  const totalDonated = donations
    ? donations.reduce((sum, d) => sum + (d.amount || 0), 0) : 0

  const { count: supporters } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('charity_id', id)
    .eq('subscription_status', 'active')

  const { data: others } = await supabaseAdmin
    .from('charities')
    .select('id, name, category, image_url')
    .eq('is_active', true)
    .neq('id', id)
    .limit(3)

  const colors = CATEGORY_COLORS[charity.category] || DEFAULT_COLOR
  const imgSrc = charity.image_url?.trim() || FALLBACK_IMG

  return (
    <div className="min-h-screen bg-[#f8faf9] font-body text-[#191c1c]">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-[#424940] mb-10">
          <Link href="/" className="hover:text-[#006d37] transition-colors">Home</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <Link href="/charities" className="hover:text-[#006d37] transition-colors">Charities</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-[#191c1c] font-medium">{charity.name}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div className="relative h-[420px] rounded-[2rem] overflow-hidden shadow-2xl">
            <img src={imgSrc} alt={charity.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002e0b]/60 to-transparent" />
            {charity.is_featured && (
              <div className="absolute top-6 left-6 flex items-center gap-1 px-4 py-2 rounded-full font-bold text-xs uppercase"
                style={{ background: '#fbbf24', color: '#78350f' }}>
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings:"'FILL' 1"}}>star</span>
                Featured
              </div>
            )}
            {charity.category && (
              <div className="absolute bottom-6 left-6">
                <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase"
                  style={{ background: colors.bg, color: colors.text }}>
                  {charity.category}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-8">
            <div>
              <h1 className="font-headline text-5xl font-extrabold text-[#002e0b] tracking-tight leading-tight mb-4">
                {charity.name}
              </h1>
              <p className="text-[#424940] text-lg leading-relaxed">
                {charity.description || 'Making a real difference in our community.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-6 rounded-[1.5rem]">
                <p className="text-xs text-[#424940] uppercase tracking-wider font-bold mb-2">Total Raised</p>
                <p className="font-headline font-extrabold text-3xl text-[#002e0b]">{formatINR(totalDonated)}</p>
                <p className="text-xs text-[#424940] mt-1">from GreenHeart members</p>
              </div>
              <div className="glass-panel p-6 rounded-[1.5rem]">
                <p className="text-xs text-[#424940] uppercase tracking-wider font-bold mb-2">Active Supporters</p>
                <p className="font-headline font-extrabold text-3xl text-[#002e0b]">
                  {(supporters || 0).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-[#424940] mt-1">contributing monthly</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/signup"
                className="text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-xl flex items-center gap-2"
                style={{background:'linear-gradient(135deg,#002e0b,#0b4619)'}}>
                <span className="material-symbols-outlined text-[#6bfe9c]">volunteer_activism</span>
                Support This Charity
              </Link>
              <Link href="/charities"
                className="glass-panel px-8 py-4 rounded-full font-bold border border-white/40 hover:bg-white/80 transition-colors text-[#002e0b]">
                ← All Charities
              </Link>
            </div>
          </div>
        </div>
        {others && others.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-headline text-3xl font-extrabold text-[#002e0b]">More causes</h2>
              <Link href="/charities" className="text-sm font-bold text-[#006d37] hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {others.map((c) => {
                const cc = CATEGORY_COLORS[c.category] || DEFAULT_COLOR
                const img = c.image_url?.trim() || FALLBACK_IMG
                return (
                  <Link key={c.id} href={`/charities/${c.id}`}
                    className="glass-panel rounded-[2rem] overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                    <div className="h-40 overflow-hidden relative">
                      <img src={img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {c.category && (
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase"
                            style={{ background: cc.bg, color: cc.text }}>{c.category}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-headline font-extrabold text-[#191c1c] text-lg">{c.name}</h3>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}