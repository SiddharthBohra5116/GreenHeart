'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'

const CATEGORIES = ['All', 'Environment', 'Health', 'Youth', 'Community']

const CHARITIES = [
  {
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
    category: 'Environment',
    name: 'Plant a Future',
    desc: 'Restoring healthy forests and reducing extreme poverty by employing local villagers to plant millions of trees every year.',
    raised: '£12,450',
    progress: 75,
  },
  {
    img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    category: 'Youth',
    name: 'Junior Golf Foundation',
    desc: 'Providing scholarships and educational resources to bright students in underserved communities through the sport of golf.',
    raised: '£6,800',
    progress: 45,
  },
  {
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800',
    category: 'Health',
    name: 'Hearts & Holes',
    desc: 'Funding cardiac research through the love of golf. Every round counts toward saving lives.',
    raised: '£8,200',
    progress: 62,
  },
  {
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    category: 'Environment',
    name: 'Summit Conservation',
    desc: 'Protecting mountain ecosystems and wildlife habitats from the effects of encroaching development.',
    raised: '£3,100',
    progress: 15,
  },
  {
    img: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=800',
    category: 'Community',
    name: 'Veterans on the Fairway',
    desc: 'Using golf as therapy and community for armed forces veterans. Healing through sport.',
    raised: '£5,100',
    progress: 60,
  },
  {
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    category: 'Health',
    name: 'Mind on the Course',
    desc: 'Mental health support for golfers and their families. Because the game starts in the mind.',
    raised: '£3,900',
    progress: 80,
  },
]

const CATEGORY_COLORS = {
  Environment: { bg: '#9bf6b2', text: '#00210c' },
  Youth:       { bg: '#6bfe9c', text: '#00210c' },
  Health:      { bg: '#c8e6c9', text: '#1b5e20' },
  Community:   { bg: '#b2dfdb', text: '#004d40' },
}

export default function Charities() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? CHARITIES
    : CHARITIES.filter(c => c.category === active)

  return (
    <div className="min-h-screen bg-[#f8faf9] font-body text-[#191c1c]">
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">

        {/* ── HERO BANNER ── */}
        <header className="rounded-[2rem] p-12 md:p-24 relative overflow-hidden
                           mb-16 shadow-2xl"
          style={{background:'linear-gradient(135deg,#002e0b 0%,#0b4619 100%)'}}>

          {/* Decorative blurs */}
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

        {/* ── CATEGORY FILTERS ── */}
        <section className="mb-12">
          <div className="flex flex-wrap items-center gap-4">
            {CATEGORIES.map((cat) => (
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
                  ? {background:'linear-gradient(135deg,#002e0b 0%,#0b4619 100%)'}
                  : {}}>
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ── CHARITIES GRID ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((c) => {
            const colors = CATEGORY_COLORS[c.category] ||
              { bg: '#9bf6b2', text: '#00210c' }

            return (
              <div key={c.name}
                className="glass-panel rounded-[2rem] p-8 flex flex-col h-full
                           group hover:-translate-y-2 transition-transform
                           duration-500">

                {/* Image */}
                <div className="mb-6 relative h-48 overflow-hidden rounded-[1.5rem]">
                  <img
                    src={c.img}
                    alt={c.name}
                    className="w-full h-full object-cover transition-transform
                               duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold
                                     uppercase tracking-wider"
                      style={{backgroundColor: colors.bg, color: colors.text}}>
                      {c.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-headline font-extrabold
                               text-[#191c1c] mb-3">
                  {c.name}
                </h3>
                <p className="text-[#424940] text-sm leading-relaxed mb-6
                              flex-grow">
                  {c.desc}
                </p>

                {/* Progress */}
                <div className="mt-auto">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-[#424940]
                                     uppercase tracking-tighter">
                      Impact Progress
                    </span>
                    <span className="text-lg font-headline font-extrabold
                                     text-[#006d37]">
                      {c.raised}{' '}
                      <span className="text-xs font-medium text-[#424940]">
                        raised
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#e1e3e2] rounded-full
                                  overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${c.progress}%`,
                        background: 'linear-gradient(135deg,#002e0b,#0b4619)'
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </section>

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