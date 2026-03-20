import Link from 'next/link'
import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import CharitiesClient from '@/components/home/CharitiesClient'

// ── Server Component — fetches from DB ──────────────────────────
export default async function Charities() {
  const { data: charities, error } = await supabaseAdmin
    .from('charities')
    .select('id, name, description, image_url, category, is_featured')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: true })

  // Graceful fallback — empty array if DB error
  const list = error ? [] : (charities || [])

  // Derive unique categories from DB data (+ 'All' prefix)
  const categories = [
    'All',
    ...Array.from(new Set(list.map(c => c.category).filter(Boolean)))
  ]

  return (
    <div className="min-h-screen bg-[#f8faf9] font-body text-[#191c1c]">
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">

        {/* ── HERO BANNER ── */}
        <header className="rounded-[2rem] p-12 md:p-24 relative overflow-hidden
                           mb-16 shadow-2xl"
          style={{background:'linear-gradient(135deg,#002e0b 0%,#0b4619 100%)'}}>

          <div className="absolute -right-20 -top-20 w-96 h-96
                          bg-[#006d37]/20 rounded-full blur-3xl
                          pointer-events-none" />
          <div className="absolute -right-10 -bottom-10 w-64 h-64
                          bg-[#6bfe9c]/10 rounded-full blur-2xl
                          pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-block bg-[#9bf6b2] text-emerald-900
                             px-4 py-1 rounded-full text-xs font-bold
                             tracking-widest uppercase mb-6">
              Our Partners
            </span>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold
                           text-white tracking-tight leading-tight mb-6">
              Charities We Support
            </h1>
            <p className="text-lg md:text-xl text-emerald-100/80 font-medium
                          max-w-xl">
              We partner with transparent, high-impact organisations
              dedicated to restoring our planet and empowering communities.
              Every subscription makes a direct difference.
            </p>
          </div>
        </header>

        {/* ── CLIENT COMPONENT handles filter + grid ── */}
        <CharitiesClient charities={list} categories={categories} />

        {/* ── CTA ── */}
        <section className="mt-24 text-center">
          <div className="glass-panel p-16 rounded-[2rem] max-w-4xl mx-auto
                          shadow-2xl shadow-emerald-900/5">
            <h2 className="text-4xl font-headline font-extrabold text-[#191c1c]
                           mb-6 tracking-tight">
              Ready to make an impact?
            </h2>
            <p className="text-[#424940] text-lg mb-10 max-w-2xl mx-auto">
              Every contribution counts towards a greener, more equitable
              future. Join thousands of golfers already making a difference.
            </p>
            <Link href="/signup"
              className="text-white px-12 py-5 rounded-full font-bold text-lg
                         inline-flex items-center gap-3 group hover:scale-105
                         transition-transform shadow-xl"
              style={{background:'linear-gradient(135deg,#002e0b 0%,#0b4619 100%)'}}>
              Join &amp; Choose Your Cause
              <span className="material-symbols-outlined transition-transform
                               group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}