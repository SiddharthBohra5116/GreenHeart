// components/home/CharityBanner.js

// ── Indian currency formatter ─────────────────────────────────────
function formatINR(amount) {
  if (!amount || amount === 0) return '₹0'
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000)   return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000)     return `₹${(amount / 1000).toFixed(1)}k`
  return `₹${Number(amount).toFixed(0)}`
}

/**
 * Props:
 *   totalDonated — all-time donation total (number)
 *   prizePool    — current prize pool (number)
 */
export default function CharityBanner({ totalDonated = 0, prizePool = 0 }) {
  const stats = [
    {
      icon: 'volunteer_activism',
      label: 'Total Donated',
      value: formatINR(totalDonated),
      sub: 'to partner charities',
    },
    {
      icon: 'account_balance_wallet',
      label: 'Current Prize Pool',
      value: formatINR(prizePool),
      sub: 'this month\'s draw',
    },
    {
      icon: 'groups',
      label: 'Impact Model',
      value: '50%',
      sub: 'of every subscription to prizes & charity',
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-6 mb-32">
      <div
        className="rounded-[2rem] p-12 md:p-16 relative overflow-hidden
                   shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #002e0b 0%, #0b4619 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-white/5
                        rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-[#6bfe9c]/10
                        rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* Heading */}
          <div className="mb-12">
            <span className="inline-block bg-[#9bf6b2] text-emerald-900
                             px-4 py-1 rounded-full text-xs font-bold
                             tracking-widest uppercase mb-4">
              Real Impact
            </span>
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold
                           text-white tracking-tight leading-tight">
              Every Swing Counts.
              <br />
              <span className="text-[#6bfe9c]">Every Penny Matters.</span>
            </h2>
            <p className="text-emerald-100/70 mt-4 text-lg max-w-2xl">
              At GreenHeart, 50% of every subscription drives two things:
              a growing prize pool for players, and direct charitable impact
              for causes that need it most.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white/10 backdrop-blur-md rounded-[1.5rem] p-6
                           border border-white/10 hover:bg-white/15
                           transition-colors"
              >
                <span className="material-symbols-outlined text-[#6bfe9c]
                                 text-3xl mb-3 block">
                  {s.icon}
                </span>
                <p className="text-xs text-emerald-200/70 uppercase tracking-widest
                               font-bold mb-1">
                  {s.label}
                </p>
                <p className="font-headline font-extrabold text-4xl text-white
                              mb-1">
                  {s.value}
                </p>
                <p className="text-sm text-emerald-200/60">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}