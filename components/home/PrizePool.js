import Link from 'next/link'

// ── Indian currency formatter ─────────────────────────────────────
function formatINR(amount) {
  if (!amount || amount === 0) return '₹0'
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000)   return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000)     return `₹${(amount / 1000).toFixed(1)}k`
  return `₹${Number(amount).toFixed(0)}`
}

// ── Props ─────────────────────────────────────────────────────────
// latestDraw — { total_pool, carry_forward_amount } | null
export default function PrizePool({ latestDraw = null }) {

  const totalPool = latestDraw
    ? (latestDraw.total_pool || 0) + (latestDraw.carry_forward_amount || 0)
    : 0

  // Prize splits per PRD: 40% / 35% / 25%
  const tiers = [
    {
      icon: 'emoji_events',
      match: '5-Number Match',
      pct: '40% of pool · Jackpot Rollover',
      amount: formatINR(totalPool * 0.4),
      featured: true,
      badge: 'JACKPOT',
    },
    {
      icon: 'workspace_premium',
      match: '4-Number Match',
      pct: '35% of pool',
      amount: formatINR(totalPool * 0.35),
      featured: false,
    },
    {
      icon: 'military_tech',
      match: '3-Number Match',
      pct: '25% of pool',
      amount: formatINR(totalPool * 0.25),
      featured: false,
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-6 mb-32">
      <div className="mb-16">
        <span className="text-[#006d37] font-bold tracking-[0.3em]
                         uppercase text-sm">
          MONTHLY PRIZE DRAW
        </span>
        <h2 className="text-4xl md:text-5xl font-headline font-extrabold
                       text-emerald-950 mt-4 tracking-tight">
          {latestDraw
            ? "This Month's Prize Pool"
            : 'Monthly Prize Pool'}
        </h2>
        {/* Show total pool if available */}
        {totalPool > 0 && (
          <p className="text-[#424940] mt-3 text-lg font-medium">
            Total pool this month:{' '}
            <span className="font-bold text-emerald-900">
              {formatINR(totalPool)}
            </span>
            {latestDraw?.carry_forward_amount > 0 && (
              <span className="ml-2 text-sm bg-[#9bf6b2] text-emerald-900
                               px-3 py-0.5 rounded-full font-bold">
                +{formatINR(latestDraw.carry_forward_amount)} rollover
              </span>
            )}
          </p>
        )}
        {/* No draw published yet */}
        {!latestDraw && (
          <p className="text-[#424940] mt-3 text-sm">
            Draw amounts are calculated once the monthly draw is published.
          </p>
        )}
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