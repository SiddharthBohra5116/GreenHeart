// components/home/CharitiesSection.js
// Server Component — fetches featured charities from DB (PRD §08)

import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import CharityImage from './CharityImage'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800'

// Fallback static data if no featured charities in DB yet
const STATIC_CHARITIES = [
  {
    id:          null,
    image_url:   'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
    stat:        '10,000 TREES PLANTED',
    name:        'Plant a Future',
    description: 'Restoring vital forest ecosystems through sustainable reforestation.',
  },
  {
    id:          null,
    image_url:   'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800',
    stat:        '₹8.2L RAISED',
    name:        'Hearts & Holes',
    description: 'Funding cardiac research through the love of golf. Every round counts.',
  },
  {
    id:          null,
    image_url:   'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    stat:        '5,000 KIDS HELPED',
    name:        'Junior Golf Foundation',
    description: 'Bringing golf to young people from underprivileged backgrounds.',
  },
]

export default async function CharitiesSection() {
  // Fetch featured charities from DB
  const { data: featured } = await supabaseAdmin
    .from('charities')
    .select('id, name, description, image_url, category')
    .eq('is_active',   true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(3)

  const charities =
    featured && featured.length > 0
      ? featured.map((c) => ({
          id:          c.id,
          image_url:   c.image_url?.trim() || FALLBACK_IMG,
          stat:        c.category ? c.category.toUpperCase() : 'FEATURED',
          name:        c.name,
          description: c.description || 'Making a difference in our community.',
        }))
      : STATIC_CHARITIES

  return (
    <section className="max-w-7xl mx-auto px-6 mb-32">
      <div className="mb-16">
        <span className="text-[#006d37] font-bold tracking-[0.3em] uppercase text-sm">
          VETTED PARTNERS. REAL CHANGE.
        </span>
        <h2 className="text-4xl md:text-5xl font-headline font-extrabold
                       text-emerald-950 mt-4 tracking-tight">
          Charities We Support
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {charities.map((c) => (
          <div
            key={c.name}
            className="group relative rounded-[2rem] overflow-hidden
                       glass-panel transition-all duration-500
                       hover:-translate-y-2 shadow-xl h-[450px]">

            {/* CharityImage is a client component — handles onError fallback */}
            <CharityImage
              src={c.image_url}
              alt={c.name}
              className="absolute inset-0 w-full h-full object-cover
                         transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t
                            from-[#001603]/90 via-[#001603]/20 to-transparent" />
            <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md
                            px-4 py-2 rounded-full">
              <span className="text-white font-bold text-sm">{c.stat}</span>
            </div>
            <div className="absolute bottom-8 left-8 right-8">
              <h4 className="text-2xl font-headline font-extrabold text-white mb-2">
                {c.name}
              </h4>
              <p className="text-emerald-100/80 line-clamp-2 text-sm">
                {c.description}
              </p>
              {c.id && (
                <Link
                  href={`/charities/${c.id}`}
                  className="inline-flex items-center gap-1 mt-3 text-xs
                             font-bold text-[#6bfe9c] hover:text-white
                             transition-colors">
                  View profile
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/charities"
          className="bg-[#eceeed] text-emerald-950 px-8 py-3 rounded-full
                     font-semibold text-sm border border-[#c1c9bd]/40
                     hover:bg-[#e6e9e8] transition-all inline-block">
          View All Charities →
        </Link>
      </div>
    </section>
  )
}