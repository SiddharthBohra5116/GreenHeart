// app/(protected)/admin/reports/page.js

import { supabaseAdmin } from '@/lib/supabaseAdmin'
import Link from 'next/link'

// ── Indian currency formatter ─────────────────────────────────────
function formatINR(amount) {
  if (!amount || amount === 0) return '₹0'
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000)   return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000)     return `₹${(amount / 1000).toFixed(1)}k`
  return `₹${Number(amount).toFixed(0)}`
}

export default async function AdminReports() {

  // ── Total users ────────────────────────────────────────────────
  const { count: totalUsers } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: activeUsers } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active')

  const { count: monthlyUsers } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_plan', 'monthly')
    .eq('subscription_status', 'active')

  const { count: yearlyUsers } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_plan', 'yearly')
    .eq('subscription_status', 'active')

  // ── Revenue ────────────────────────────────────────────────────
  const monthlyRevenue = (monthlyUsers || 0) * 799
  const yearlyRevenue  = (yearlyUsers  || 0) * (7999 / 12)
  const totalRevenue   = monthlyRevenue + yearlyRevenue

  // ── Donations per charity ──────────────────────────────────────
  const { data: donations } = await supabaseAdmin
    .from('donations')
    .select('amount, charity_id, charities(name, category)')

  const charityTotals = {}
  for (const d of donations || []) {
    const id   = d.charity_id
    const name = d.charities?.name || 'Unknown'
    const cat  = d.charities?.category || ''
    if (!charityTotals[id]) charityTotals[id] = { name, category: cat, total: 0, count: 0 }
    charityTotals[id].total += d.amount || 0
    charityTotals[id].count += 1
  }

  const totalDonated = Object.values(charityTotals).reduce((s, c) => s + c.total, 0)

  const charityRows = Object.entries(charityTotals)
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.total - a.total)

  // ── Draw statistics ────────────────────────────────────────────
  const { data: draws } = await supabaseAdmin
    .from('draws')
    .select('draw_month, total_pool, carry_forward_amount, status')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(6)

  const { count: totalWinners } = await supabaseAdmin
    .from('draw_results')
    .select('*', { count: 'exact', head: true })
    .gte('match_count', 3)

  const { count: paidWinners } = await supabaseAdmin
    .from('draw_results')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'paid')

  const { data: prizeData } = await supabaseAdmin
    .from('draw_results')
    .select('prize_amount')
    .gte('match_count', 3)

  const totalPrizePaid = (prizeData || []).reduce((s, r) => s + (r.prize_amount || 0), 0)

  // ── Monthly donations (this month) ────────────────────────────
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const { data: monthlyDonations } = await supabaseAdmin
    .from('donations')
    .select('amount')
    .gte('created_at', monthStart.toISOString())

  const monthlyDonated = (monthlyDonations || []).reduce((s, d) => s + (d.amount || 0), 0)

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-5xl font-extrabold font-headline text-[#002e0b] mb-2">
          Reports & Analytics
        </h1>
        <p className="text-[#424940] font-medium max-w-xl">
          Platform-wide financial overview, charity contribution totals and draw statistics.
        </p>
      </div>

      {/* ── Top KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: 'group',
            label: 'Total Users',
            value: totalUsers || 0,
            sub: `${activeUsers || 0} active`,
            color: 'text-[#006d37]',
          },
          {
            icon: 'account_balance_wallet',
            label: 'Monthly Revenue',
            value: formatINR(totalRevenue),
            sub: `${monthlyUsers || 0} monthly · ${yearlyUsers || 0} yearly`,
            color: 'text-[#006d37]',
          },
          {
            icon: 'volunteer_activism',
            label: 'Total Donated',
            value: formatINR(totalDonated),
            sub: `${formatINR(monthlyDonated)} this month`,
            color: 'text-[#006d37]',
          },
          {
            icon: 'emoji_events',
            label: 'Total Prizes Issued',
            value: formatINR(totalPrizePaid),
            sub: `${paidWinners || 0} / ${totalWinners || 0} winners paid`,
            color: 'text-amber-600',
          },
        ].map((s) => (
          <div key={s.label}
            className="glass-panel p-8 rounded-[2rem] hover:shadow-xl
                       transition-shadow">
            <span className={`material-symbols-outlined text-3xl mb-4 block ${s.color}`}>
              {s.icon}
            </span>
            <p className="text-[#424940] text-sm font-medium mb-1">{s.label}</p>
            <h3 className="text-3xl font-extrabold text-[#002e0b] font-headline">
              {s.value}
            </h3>
            <p className="text-xs text-[#424940] mt-2">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Revenue Breakdown ── */}
      <div className="glass-panel rounded-[2rem] p-8 shadow-sm">
        <h2 className="text-2xl font-bold font-headline text-[#002e0b] mb-6">
          Revenue Breakdown
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              label: 'Monthly Plan Revenue',
              value: formatINR(monthlyRevenue),
              detail: `${monthlyUsers || 0} users × ₹799`,
              pct: totalRevenue > 0
                ? Math.round((monthlyRevenue / totalRevenue) * 100)
                : 0,
            },
            {
              label: 'Yearly Plan Revenue',
              value: formatINR(yearlyRevenue),
              detail: `${yearlyUsers || 0} users × ₹666/mo`,
              pct: totalRevenue > 0
                ? Math.round((yearlyRevenue / totalRevenue) * 100)
                : 0,
            },
            {
              label: 'Prize Pool (50%)',
              value: formatINR(totalRevenue * 0.5),
              detail: '50% of total revenue',
              pct: 50,
            },
          ].map((r) => (
            <div key={r.label} className="bg-[#f2f4f3] rounded-[1.5rem] p-6">
              <p className="text-xs text-[#424940] uppercase tracking-wider font-bold mb-2">
                {r.label}
              </p>
              <p className="font-headline font-extrabold text-3xl text-[#002e0b] mb-1">
                {r.value}
              </p>
              <p className="text-xs text-[#424940]">{r.detail}</p>
              <div className="mt-3 h-2 bg-[#e1e3e2] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${r.pct}%`,
                    background: 'linear-gradient(135deg,#002e0b,#0b4619)',
                  }}
                />
              </div>
              <p className="text-xs text-[#424940] mt-1">{r.pct}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Charity Contribution Totals ── */}
      <div className="glass-panel rounded-[2rem] p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-headline text-[#002e0b]">
            Charity Contribution Totals
          </h2>
          <Link href="/admin/charities"
            className="text-xs font-bold text-[#006d37] hover:underline">
            Manage Charities →
          </Link>
        </div>

        {charityRows.length === 0 ? (
          <p className="text-[#424940] text-sm text-center py-8">
            No donations recorded yet.
          </p>
        ) : (
          <div className="space-y-4">
            {charityRows.map((c) => {
              const pct = totalDonated > 0
                ? Math.round((c.total / totalDonated) * 100)
                : 0
              return (
                <div key={c.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <div>
                        <span className="font-bold text-sm text-[#002e0b]">{c.name}</span>
                        {c.category && (
                          <span className="ml-2 text-xs text-[#424940] bg-[#f2f4f3]
                                           px-2 py-0.5 rounded-full">
                            {c.category}
                          </span>
                        )}
                      </div>
                      <span className="font-headline font-extrabold text-[#006d37]">
                        {formatINR(c.total)}
                      </span>
                    </div>
                    <div className="h-2 bg-[#e1e3e2] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: 'linear-gradient(135deg,#006d37,#0b4619)',
                        }}
                      />
                    </div>
                    <p className="text-xs text-[#424940] mt-0.5">
                      {pct}% of total · {c.count} donation{c.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              )
            })}
            <div className="border-t border-[#c1c9bd]/20 pt-4 flex justify-between">
              <span className="font-bold text-[#002e0b]">Total Donated</span>
              <span className="font-headline font-extrabold text-[#006d37] text-xl">
                {formatINR(totalDonated)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Draw Statistics ── */}
      <div className="glass-panel rounded-[2rem] p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-headline text-[#002e0b]">
            Draw History
          </h2>
          <Link href="/admin/draw"
            className="text-xs font-bold text-[#006d37] hover:underline">
            Run New Draw →
          </Link>
        </div>

        {(!draws || draws.length === 0) ? (
          <p className="text-[#424940] text-sm text-center py-8">
            No draws published yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f2f4f3] rounded-[1rem]">
                <tr>
                  {['Month', 'Total Pool', 'Carry Forward', 'Status'].map(h => (
                    <th key={h}
                      className="text-left px-4 py-3 text-xs font-bold uppercase
                                 tracking-wider text-[#424940] first:rounded-l-[1rem]
                                 last:rounded-r-[1rem]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c1c9bd]/10">
                {draws.map((d) => (
                  <tr key={d.draw_month} className="hover:bg-white/40 transition-colors">
                    <td className="px-4 py-4 font-bold text-[#002e0b]">
                      {d.draw_month}
                    </td>
                    <td className="px-4 py-4 font-headline font-extrabold text-[#006d37]">
                      {formatINR(d.total_pool || 0)}
                    </td>
                    <td className="px-4 py-4 text-[#424940]">
                      {d.carry_forward_amount > 0
                        ? <span className="text-amber-600 font-bold">
                            +{formatINR(d.carry_forward_amount)} rollover
                          </span>
                        : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold
                                       bg-[#9bf6b2] text-emerald-900 uppercase">
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}