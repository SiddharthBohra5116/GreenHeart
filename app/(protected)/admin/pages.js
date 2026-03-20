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

  const totalPool = activeUsers * 4.995

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[#c9a84c] text-xs tracking-[3px] uppercase mb-2">Control Panel</p>
        <h1 className="font-playfair text-5xl">Admin Overview</h1>
        <div className="w-12 h-0.5 bg-[#c9a84c] mt-3"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: totalUsers || 0 },
          { label: 'Active Subscribers', value: activeUsers || 0 },
          { label: 'Prize Pool', value: `£${totalPool.toFixed(0)}` },
          { label: 'Pending Verifications', value: pendingWinners || 0, alert: pendingWinners > 0 },
        ].map((stat) => (
          <div key={stat.label}
            className={`border p-6 ${stat.alert
              ? 'border-[#c9a84c] bg-[#c9a84c]/5'
              : 'border-[#1a4a2e]'}`}>
            <div className="text-[#4a5a4e] text-xs uppercase tracking-wider mb-2">
              {stat.label}
            </div>
            <div className={`font-playfair text-4xl ${stat.alert
              ? 'text-[#c9a84c]'
              : 'text-[#f0ece0]'}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[#1a4a2e] p-6">
          <h2 className="font-playfair text-2xl mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/draw"
              className="block border border-[#c9a84c] text-[#c9a84c] px-6 py-3 text-sm
                         font-bold tracking-widest uppercase text-center
                         hover:bg-[#c9a84c] hover:text-[#0a0f0a] transition-colors">
              🎲 Run Monthly Draw
            </Link>
            <Link href="/admin/winners"
              className="block border border-[#1a4a2e] text-[#7a9e7e] px-6 py-3 text-sm
                         font-bold tracking-widest uppercase text-center
                         hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors">
              🏆 Review Winners ({pendingWinners || 0} pending)
            </Link>
            <Link href="/admin/charities"
              className="block border border-[#1a4a2e] text-[#7a9e7e] px-6 py-3 text-sm
                         font-bold tracking-widest uppercase text-center
                         hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors">
              ❤️ Manage Charities
            </Link>
          </div>
        </div>

        <div className="border border-[#1a4a2e] p-6">
          <h2 className="font-playfair text-2xl mb-4">Latest Draw</h2>
          {latestDraw ? (
            <div className="space-y-3">
              <div>
                <div className="text-xs text-[#4a5a4e] uppercase tracking-wider mb-1">Month</div>
                <div className="font-bold">{latestDraw.draw_month}</div>
              </div>
              <div>
                <div className="text-xs text-[#4a5a4e] uppercase tracking-wider mb-1">Numbers</div>
                <div className="flex gap-2">
                  {latestDraw.numbers?.map((n) => (
                    <span key={n}
                      className="bg-[#0f2d1a] border border-[#c9a84c] text-[#c9a84c]
                                 w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#4a5a4e] uppercase tracking-wider mb-1">Status</div>
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 ${
                  latestDraw.status === 'published'
                    ? 'bg-emerald-900/30 text-emerald-400'
                    : 'bg-yellow-900/30 text-yellow-400'
                }`}>
                  {latestDraw.status}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-[#4a5a4e] text-sm">No draws run yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}