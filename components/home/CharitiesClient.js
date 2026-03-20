// components/home/CharitiesClient.js
'use client'

import { useState } from 'react'
import Link from 'next/link'

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

export default function CharitiesClient({ charities, categories }) {
  const [active, setActive] = useState('All')
  const [query,  setQuery]  = useState('')

  // Filter by both category AND search query
  const filtered = charities.filter((c) => {
    const matchesCategory = active === 'All' || c.category === active
    const q = query.toLowerCase().trim()
    const matchesSearch =
      !q ||
      (c.name        || '').toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q) ||
      (c.category    || '').toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  return (
    <>
      {/* ── SEARCH BAR ── */}
      <section className="mb-8">
        <div className="relative max-w-xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2
                           -translate-y-1/2 text-[#424940] text-xl pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search charities by name, description or category…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 rounded-full bg-white
                       border border-[#c1c9bd] text-sm text-[#191c1c]
                       placeholder:text-[#72796f] outline-none
                       focus:border-[#006d37] focus:ring-2
                       focus:ring-[#006d37]/10 transition-all shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2
                         text-[#72796f] hover:text-[#191c1c] transition-colors">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          )}
        </div>
      </section>

      {/* ── CATEGORY FILTERS ── */}
      <section className="mb-12">
        <div className="flex flex-wrap items-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-8 py-3 rounded-full font-semibold text-sm
                          transition-all duration-300 ${
                active === cat
                  ? 'text-white shadow-lg hover:scale-105'
                  : 'bg-[#f2f4f3] text-[#424940] hover:bg-[#e6e9e8]'
              }`}
              style={active === cat
                ? { background: 'linear-gradient(135deg,#002e0b 0%,#0b4619 100%)' }
                : {}}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── RESULTS COUNT ── */}
      {(query || active !== 'All') && (
        <p className="text-xs text-[#424940] font-medium mb-6">
          Showing <span className="font-bold text-[#002e0b]">{filtered.length}</span> of{' '}
          <span className="font-bold text-[#002e0b]">{charities.length}</span> charities
          {query && <span> matching &ldquo;{query}&rdquo;</span>}
          {active !== 'All' && <span> in <span className="font-bold">{active}</span></span>}
          {(query || active !== 'All') && (
            <button
              onClick={() => { setQuery(''); setActive('All') }}
              className="ml-3 text-[#006d37] font-bold hover:underline">
              Clear filters
            </button>
          )}
        </p>
      )}

      {/* ── CHARITIES GRID ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-24">
            <span className="material-symbols-outlined text-5xl
                             text-[#c1c9bd] block mb-4">
              search_off
            </span>
            <p className="text-[#424940] text-lg font-medium">
              No charities found{query ? ` matching "${query}"` : ' in this category'}.
            </p>
            <button
              onClick={() => { setQuery(''); setActive('All') }}
              className="mt-4 text-sm text-[#006d37] font-bold hover:underline">
              Clear all filters
            </button>
          </div>
        ) : (
          filtered.map((c) => {
            const colors = CATEGORY_COLORS[c.category] || DEFAULT_COLOR
            const imgSrc = c.image_url?.trim() || FALLBACK_IMG

            return (
              <Link
                key={c.id}
                href={`/charities/${c.id}`}
                className="glass-panel rounded-[2rem] p-8 flex flex-col h-full
                           group hover:-translate-y-2 transition-transform
                           duration-500 cursor-pointer">

                {/* Image */}
                <div className="mb-6 relative h-48 overflow-hidden
                                rounded-[1.5rem]">
                  <img
                    src={imgSrc}
                    alt={c.name}
                    className="w-full h-full object-cover transition-transform
                               duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.src = FALLBACK_IMG }}
                  />

                  {/* Category badge */}
                  {c.category && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs
                                       font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                        }}>
                        {c.category}
                      </span>
                    </div>
                  )}

                  {/* Featured badge */}
                  {c.is_featured && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full text-xs
                                       font-bold uppercase tracking-wider
                                       flex items-center gap-1"
                        style={{ background: '#fbbf24', color: '#78350f' }}>
                        <span className="material-symbols-outlined text-sm"
                          style={{fontVariationSettings:"'FILL' 1"}}>
                          star
                        </span>
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-headline font-extrabold
                               text-[#191c1c] mb-3">
                  {c.name}
                </h3>
                <p className="text-[#424940] text-sm leading-relaxed mb-6
                              flex-grow">
                  {c.description || 'Making a difference in our community.'}
                </p>

                {/* View profile CTA */}
                <div className="mt-auto flex items-center justify-between">
                  <div className="h-1 w-12 rounded-full"
                    style={{background:'linear-gradient(135deg,#002e0b,#0b4619)'}} />
                  <span className="text-xs font-bold text-[#006d37]
                                   flex items-center gap-1
                                   group-hover:gap-2 transition-all">
                    View profile
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </Link>
            )
          })
        )}
      </section>
    </>
  )
}