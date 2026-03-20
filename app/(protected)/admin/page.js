import { supabaseAdmin } from '@/lib/supabaseAdmin'
import Link from 'next/link'

export default async function AdminOverview() {
  const { count: totalUsers } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: activeUsers } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active')

  const { count: pendingWinners } = await supabaseAdmin
    .from('draw_results')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending_verification')

  const { data: latestDraw } = await supabaseAdmin
    .from('draws')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const { data: recentWinners } = await supabaseAdmin
    .from('draw_results')
    .select('*, users(name, email)')
    .gte('match_count', 3)
    .order('created_at', { ascending: false })
    .limit(3)

  const totalPool = (activeUsers || 0) * 4.995

  const STATS = [
    {
      icon: 'group',
      label: 'Total Users',
      value: totalUsers || 0,
      trend: 'trending_up',
      trendLabel: 'All time',
      alert: false,
    },
    {
      icon: 'subscriptions',
      label: 'Active Subs',
      value: activeUsers || 0,
      trend: 'trending_up',
      trendLabel: 'Active now',
      alert: false,
    },
    {
      icon: 'account_balance_wallet',
      label: 'Prize Pool',
      value: `£${totalPool.toFixed(0)}`,
      trend: 'account_tree',
      trendLabel: 'Multi-tier',
      alert: false,
    },
    {
      icon: 'pending_actions',
      label: 'Pending Claims',
      value: pendingWinners || 0,
      trend: 'warning',
      trendLabel: 'Action Required',
      alert: (pendingWinners || 0) > 0,
    },
  ]

  return (
    <div>
      {/* Header */}
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-[#002e0b]
                         leading-none mb-2 font-headline">
            System Overview
          </h2>
          <p className="text-[#424940] font-medium">
            Monitoring platform-wide impact and growth metrics.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/draw"
            className="px-6 py-3 rounded-full text-white font-semibold
                       shadow-lg hover:scale-105 transition-all flex
                       items-center gap-2 text-sm"
            style={{background:'linear-gradient(135deg,#002e0b,#0b4619)'}}>
            <span className="material-symbols-outlined text-lg">
              casino
            </span>
            Run Draw
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {STATS.map((s) => (
          <div key={s.label}
            className="glass-panel p-8 rounded-[2rem] flex flex-col
                       justify-between hover:shadow-2xl transition-shadow">
            <span className={`material-symbols-outlined text-3xl mb-4 ${
              s.alert ? 'text-red-500' : 'text-[#006d37]'
            }`}>
              {s.icon}
            </span>
            <div>
              <p className="text-[#424940] text-sm font-medium">{s.label}</p>
              <h3 className="text-3xl font-extrabold text-[#002e0b]
                             font-headline">
                {s.value}
              </h3>
            </div>
            <div className={`mt-4 flex items-center gap-1 font-bold text-sm ${
              s.alert ? 'text-red-500' : 'text-[#006d37]'
            }`}>
              <span className="material-symbols-outlined text-xs">
                {s.trend}
              </span>
              {s.trendLabel}
            </div>
          </div>
        ))}
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Users Preview */}
        <section className="xl:col-span-2">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-extrabold text-[#002e0b]
                             font-headline">
                User Directory
              </h3>
              <Link href="/admin/users"
                className="text-xs font-bold text-[#006d37] hover:underline">
                View All →
              </Link>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="text-[#424940] border-b border-[#eceeed]
                               uppercase text-[10px] tracking-widest font-bold">
                  <th className="pb-4 px-4">User</th>
                  <th className="pb-4 px-4">Plan</th>
                  <th className="pb-4 px-4">Status</th>
                  <th className="pb-4 px-4">Charity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceeed]">
                {/* Fetched in users page — show placeholder here */}
                <tr className="hover:bg-[#f2f4f3]/50 transition-colors">
                  <td className="py-5 px-4" colSpan={4}>
                    <Link href="/admin/users"
                      className="text-sm text-[#006d37] font-bold
                                 hover:underline">
                      View all {totalUsers || 0} users →
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Draw + Winners */}
        <section className="space-y-8">

          {/* Draw Card */}
          <div className="rounded-[2rem] p-8 text-white relative overflow-hidden
                          shadow-xl"
            style={{background:'linear-gradient(135deg,#002e0b,#0b4619)'}}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5
                            rounded-full -mr-16 -mt-16 blur-3xl
                            pointer-events-none" />
            <h3 className="text-xl font-extrabold mb-2 relative z-10
                           font-headline">
              Monthly Grand Draw
            </h3>
            <p className="text-white/60 text-sm mb-8 relative z-10">
              {latestDraw
                ? `Last: ${latestDraw.draw_month} — ${latestDraw.status}`
                : 'No draws run yet'}
            </p>

            {latestDraw?.numbers && (
              <div className="flex gap-2 mb-6 relative z-10">
                {latestDraw.numbers.map((n) => (
                  <div key={n}
                    className="w-10 h-10 rounded-full bg-[#6bfe9c]
                               text-[#00210c] flex items-center justify-center
                               font-bold text-sm">
                    {n}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3 relative z-10">
              <Link href="/admin/draw"
                className="w-full py-4 rounded-full bg-[#6bfe9c] text-[#00210c]
                           font-bold hover:scale-105 transition-all flex
                           items-center justify-center gap-2 text-sm">
                <span className="material-symbols-outlined text-xl">
                  play_circle
                </span>
                Run Simulation
              </Link>
            </div>
          </div>

          {/* Recent Winners */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-[#002e0b]
                             font-headline">
                Recent Winners
              </h3>
              <Link href="/admin/winners"
                className="text-xs font-bold text-[#006d37] hover:underline">
                All Records
              </Link>
            </div>

            {recentWinners && recentWinners.length > 0 ? (
              <div className="space-y-6">
                {recentWinners.map((w) => (
                  <div key={w.id} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[1rem] bg-[#f2f4f3]
                                    flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#006d37]"
                        style={{fontVariationSettings:"'FILL' 1"}}>
                        {w.status === 'paid' ? 'stars' : 'award_star'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="font-bold text-sm text-[#002e0b] truncate">
                          {w.users?.name || 'Unknown'}
                        </p>
                        <p className="text-xs font-bold text-[#006d37]">
                          £{w.prize_amount?.toFixed(0)}
                        </p>
                      </div>
                      <p className="text-xs text-[#424940] mb-2">
                        {w.match_count}-Match
                      </p>
                      <span className={`inline-flex items-center gap-1
                                       text-[10px] font-bold px-2 py-1
                                       rounded-[0.5rem] ${
                        w.status === 'paid'
                          ? 'bg-[#9bf6b2] text-[#00210c]'
                          : w.status === 'approved'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        <span className="material-symbols-outlined text-[12px]">
                          {w.status === 'paid' ? 'verified' : 'pending'}
                        </span>
                        {w.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#424940] text-sm text-center py-4">
                No winners yet
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <section className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-[2rem] border border-[#006d37]/20
                          bg-[#006d37]/5 flex gap-6 items-center">
            <div className="w-16 h-16 rounded-full bg-[#006d37]/10 flex
                            items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#006d37] text-3xl">
                volunteer_activism
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-[#002e0b] font-headline">
                Charity Management
              </h4>
              <p className="text-sm text-[#424940]">
                Add, edit or remove charities from the platform.
              </p>
            </div>
            <Link href="/admin/charities"
              className="ml-auto px-4 py-2 bg-[#006d37] text-white text-xs
                         font-bold rounded-full hover:scale-105 transition-all
                         shrink-0">
              Manage
            </Link>
          </div>

          <div className="p-6 rounded-[2rem] border border-amber-200
                          bg-amber-50 flex gap-6 items-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex
                            items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-amber-600 text-3xl">
                pending_actions
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-[#002e0b] font-headline">
                Pending Verifications
              </h4>
              <p className="text-sm text-[#424940]">
                {pendingWinners || 0} winner{(pendingWinners || 0) !== 1 ? 's' : ''} waiting for review.
              </p>
            </div>
            <Link href="/admin/winners"
              className="ml-auto px-4 py-2 bg-amber-500 text-white text-xs
                         font-bold rounded-full hover:scale-105 transition-all
                         shrink-0">
              Review
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}