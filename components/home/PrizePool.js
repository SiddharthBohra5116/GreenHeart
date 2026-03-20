import Link from 'next/link'

const tiers = [
  {
    icon: 'emoji_events',
    match: '5-Number Match',
    pct: '40% of pool · Jackpot Rollover',
    amount: '£4,800',
    featured: true,
    badge: 'JACKPOT',
  },
  {
    icon: 'workspace_premium',
    match: '4-Number Match',
    pct: '35% of pool',
    amount: '£4,200',
    featured: false,
  },
  {
    icon: 'military_tech',
    match: '3-Number Match',
    pct: '25% of pool',
    amount: '£3,000',
    featured: false,
  },
]

export default function PrizePool() {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-32">
      <div className="mb-16">
        <span className="text-[#006d37] font-bold tracking-[0.3em]
                         uppercase text-sm">
          MONTHLY PRIZE DRAW
        </span>
        <h2 className="text-4xl md:text-5xl font-headline font-extrabold
                       text-emerald-950 mt-4 tracking-tight">
          This Month's Prize Pool
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div key={tier.match}
            className={`glass-panel rounded-[2rem] p-8 shadow-xl
                        hover:-translate-y-1 transition-transform duration-300
                        border ${tier.featured
                          ? 'border-[#006d37]/30'
                          : 'border-white/40'}`}>
            {tier.featured && (
              <div className="inline-flex items-center gap-1 bg-[#006d37]/10
                              text-[#006d37] px-3 py-1 rounded-full text-xs
                              font-bold uppercase tracking-wider mb-4">
                <span className="material-symbols-outlined text-sm"
                  style={{fontVariationSettings:"'FILL' 1"}}>star</span>
                {tier.badge}
              </div>
            )}
            <span className="material-symbols-outlined text-4xl
                             text-[#006d37] mb-4 block">
              {tier.icon}
            </span>
            <div className="text-xs text-[#424940] uppercase tracking-wider mb-2">
              {tier.match}
            </div>
            <div className="font-headline font-extrabold text-5xl
                            text-emerald-950 mb-2">
              {tier.amount}
            </div>
            <div className="text-sm text-[#424940]">{tier.pct}</div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link href="/signup"
          className="signature-gradient text-white px-10 py-4 rounded-full
                     font-bold text-lg hover:scale-105 transition-transform
                     shadow-xl inline-block">
          Join the Draw →
        </Link>
      </div>
    </section>
  )
}