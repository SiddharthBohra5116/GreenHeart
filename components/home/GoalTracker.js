// ── Indian currency formatter ─────────────────────────────────────
function formatINR(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000)   return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000)     return `₹${(amount / 1000).toFixed(0)}k`
  return `₹${amount.toFixed(0)}`
}

// ── Props ─────────────────────────────────────────────────────────
// monthlyRaised — £ donated this calendar month
// monthlyGoal   — target (e.g. 50000)
// goalPercent   — 0–100 integer
// totalDonated  — all-time total (used in subtext)
export default function GoalTracker({
  monthlyRaised = 0,
  monthlyGoal = 50000,
  goalPercent = 0,
  totalDonated = 0,
}) {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-32">
      <div className="bg-[#e1e3e2] rounded-[2rem] p-12 md:p-16 flex
                      flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/3">
          <h2 className="text-3xl font-headline font-extrabold
                         text-emerald-950 mb-4">
            Monthly Goal Tracker
          </h2>
          <p className="text-[#424940] font-medium leading-relaxed">
            Join us in reaching our milestone of{' '}
            <span className="font-bold text-emerald-900">
              {formatINR(monthlyGoal)}
            </span>{' '}
            for charity this month. Every subscription helps.
          </p>
          {totalDonated > 0 && (
            <p className="text-xs text-[#424940] mt-3 font-medium">
              All-time raised:{' '}
              <span className="font-bold text-emerald-900">
                {formatINR(totalDonated)}
              </span>
            </p>
          )}
        </div>

        <div className="lg:w-2/3 w-full">
          <div className="flex justify-between items-end mb-4">
            <span className="text-4xl font-headline font-extrabold
                             text-emerald-950">
              {goalPercent}%
            </span>
            <span className="text-[#424940] font-bold">
              {formatINR(monthlyRaised)} / {formatINR(monthlyGoal)}
            </span>
          </div>
          <div className="w-full h-8 bg-[#f2f4f3] rounded-full
                          overflow-hidden p-1 shadow-inner">
            <div
              className="h-full signature-gradient rounded-full
                         shadow-[0_0_20px_rgba(0,109,55,0.4)]
                         transition-all duration-1000"
              style={{ width: `${goalPercent}%` }}
            />
          </div>

          {/* Milestone markers */}
          <div className="flex justify-between mt-2 px-1">
            {[25, 50, 75, 100].map((m) => (
              <span
                key={m}
                className="text-xs font-medium"
                style={{ color: goalPercent >= m ? '#006d37' : '#c1c9bd' }}>
                {m}%
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}