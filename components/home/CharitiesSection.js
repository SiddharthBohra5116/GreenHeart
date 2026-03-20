import Link from 'next/link'

const charities = [
  {
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
    stat: '10,000 TREES PLANTED',
    name: 'Plant a Future',
    desc: 'Restoring vital forest ecosystems through sustainable reforestation.',
  },
  {
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800',
    stat: '£8,200 RAISED',
    name: 'Hearts & Holes',
    desc: 'Funding cardiac research through the love of golf. Every round counts.',
  },
  {
    img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    stat: '5,000 KIDS HELPED',
    name: 'Junior Golf Foundation',
    desc: 'Bringing golf to young people from underprivileged backgrounds.',
  },
]

export default function CharitiesSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-32">
      <div className="mb-16">
        <span className="text-[#006d37] font-bold tracking-[0.3em]
                         uppercase text-sm">
          VETTED PARTNERS. REAL CHANGE.
        </span>
        <h2 className="text-4xl md:text-5xl font-headline font-extrabold
                       text-emerald-950 mt-4 tracking-tight">
          Charities We Support
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {charities.map((c) => (
          <div key={c.name}
            className="group relative rounded-[2rem] overflow-hidden
                       glass-panel transition-all duration-500
                       hover:-translate-y-2 shadow-xl h-[450px]">
            <img
              src={c.img}
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
              <h4 className="text-2xl font-headline font-extrabold
                             text-white mb-2">
                {c.name}
              </h4>
              <p className="text-emerald-100/80 line-clamp-2 text-sm">
                {c.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link href="/charities"
          className="bg-[#eceeed] text-emerald-950 px-8 py-3 rounded-full
                     font-semibold text-sm border border-[#c1c9bd]/40
                     hover:bg-[#e6e9e8] transition-all inline-block">
          View All Charities →
        </Link>
      </div>
    </section>
  )
}