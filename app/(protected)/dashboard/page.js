import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { redirect } from 'next/navigation'
import ScoreCard from '@/components/dashboard/ScoreCard'
import CharityPicker from '@/components/dashboard/CharityPicker'

export default async function Dashboard() {
  const user = await getUserProfile()

  if (!user) redirect('/login')
  // if (user.subscription_status === 'inactive') redirect('/pricing')

  const { data: scores } = await supabaseAdmin
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(5)

  const { data: charities } = await supabaseAdmin
    .from('charities')
    .select('id, name, category')
    .eq('is_active', true)

  const { count: participationCount } = await supabaseAdmin
    .from('draw_results')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { data: winnings } = await supabaseAdmin
    .from('draw_results')
    .select('prize_amount, status, match_count, created_at')
    .eq('user_id', user.id)
    .gte('match_count', 3)
    .order('created_at', { ascending: false })

  const { data: latestDraw } = await supabaseAdmin
    .from('draws')
    .select('total_pool, carry_forward_amount, draw_month')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const totalWon = winnings?.reduce((sum, w) => sum + (w.prize_amount || 0), 0) || 0

  const now = new Date()
  const nextDraw = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const daysLeft = Math.ceil((nextDraw - now) / (1000 * 60 * 60 * 24))

   return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#f0ece0]">

      {/* Nav Bar */}
      <div className="border-b border-[#1a4a2e] px-8 py-4 flex items-center
                      justify-between bg-[#0a0f0a] sticky top-0 z-10">
        <div className="font-playfair text-xl text-[#c9a84c]">
          GREEN<span className="text-[#f0ece0]">HEART</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="/" className="text-sm text-[#7a9e7e] hover:text-[#f0ece0] transition-colors">
            Home
          </a>
          <a href="/charities"
            className="text-sm text-[#7a9e7e] hover:text-[#f0ece0] transition-colors">
            Charities
          </a>
          <span className="text-sm text-[#7a9e7e]">
            {user.name}
          </span>
          <a href="/api/auth/logout"
            className="text-xs text-[#4a5a4e] hover:text-red-400 transition-colors
                       uppercase tracking-wider">
            Logout
          </a>
        </div>
      </div>

      {/* Subscription Banner — only shown when inactive */}
      {user.subscription_status !== 'active' && (
        <div className="bg-[#c9a84c] text-[#0a0f0a] px-8 py-3 flex items-center
                        justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm">⚡ Subscribe to unlock scores, draws & prizes</span>
          </div>
          <a href="/pricing"
            className="bg-[#0a0f0a] text-[#c9a84c] px-4 py-1.5 text-xs font-bold
                       uppercase tracking-wider hover:bg-[#0f2d1a] transition-colors">
            View Plans →
          </a>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
        <div>
          <p className="text-[#c9a84c] text-xs tracking-[3px] uppercase mb-2">My Account</p>
          <h1 className="font-playfair text-5xl">Dashboard</h1>
          <div className="w-12 h-0.5 bg-[#c9a84c] mt-3"></div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-[#1a4a2e] p-6">
            <p className="text-[#4a5a4e] text-xs uppercase tracking-wider mb-2">Subscription</p>
            <p className="font-playfair text-3xl capitalize text-[#f0ece0]">
              {user.subscription_status}
            </p>
            <p className="text-xs text-[#4a5a4e] mt-2">
              {user.subscription_expiry
                ? `Expires: ${new Date(user.subscription_expiry).toLocaleDateString('en-GB')}`
                : 'Not subscribed'}
            </p>
          </div>

          <div className="border border-[#1a4a2e] p-6">
            <p className="text-[#4a5a4e] text-xs uppercase tracking-wider mb-2">Draws Entered</p>
            <p className="font-playfair text-3xl text-[#f0ece0]">{participationCount || 0}</p>
          </div>

          <div className="border border-[#1a4a2e] p-6">
            <p className="text-[#4a5a4e] text-xs uppercase tracking-wider mb-2">Total Won</p>
            <p className="font-playfair text-3xl text-[#c9a84c]">£{totalWon.toFixed(2)}</p>
          </div>

          <div className="border border-[#1a4a2e] p-6">
            <p className="text-[#4a5a4e] text-xs uppercase tracking-wider mb-2">Next Draw</p>
            <p className="font-playfair text-3xl text-[#f0ece0]">{daysLeft} days</p>
          </div>
        </div>

        {/* Locked state for inactive users */}
        {user.subscription_status !== 'active' ? (
          <div className="border border-dashed border-[#1a4a2e] p-16 text-center">
            <p className="font-playfair text-4xl text-[#4a5a4e] mb-4">
              Subscribe to Get Started
            </p>
            <p className="text-[#2a3a2e] mb-8 max-w-md mx-auto">
              Choose a plan to start entering scores, joining monthly draws, 
              and supporting your favourite charity.
            </p>
            <a href="/pricing"
              className="bg-[#c9a84c] text-[#0a0f0a] px-10 py-4 font-bold
                         tracking-widest uppercase text-sm hover:bg-[#b8943d] transition-colors">
              View Plans →
            </a>
          </div>
        ) : (
          /* Active user content */
          <>
            {latestDraw && (
              <div className="border border-[#c9a84c] bg-[#0f2d1a] p-6
                              flex justify-between items-center">
                <div>
                  <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-[3px] mb-2">
                    Current Prize Pool
                  </p>
                  <p className="font-playfair text-5xl text-[#f0ece0]">
                    £{(
                      (latestDraw.total_pool || 0) +
                      (latestDraw.carry_forward_amount || 0)
                    ).toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#4a5a4e] text-xs uppercase tracking-wider mb-1">
                    Jackpot Rollover
                  </p>
                  <p className="font-playfair text-3xl text-[#c9a84c]">
                    +£{(latestDraw.carry_forward_amount || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <ScoreCard initialScores={scores || []} />
                <div className="border border-[#1a4a2e] p-6">
                  <p className="text-[#c9a84c] text-xs tracking-[3px] uppercase mb-1">
                    History
                  </p>
                  <h2 className="font-playfair text-2xl mb-6">My Winnings</h2>
                  {winnings && winnings.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#1a4a2e]">
                          <th className="text-left pb-3 text-xs text-[#4a5a4e]
                                         uppercase tracking-wider">Match</th>
                          <th className="text-left pb-3 text-xs text-[#4a5a4e]
                                         uppercase tracking-wider">Prize</th>
                          <th className="text-left pb-3 text-xs text-[#4a5a4e]
                                         uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1a4a2e]">
                        {winnings.map((w, i) => (
                          <tr key={i} className="hover:bg-[#0f2d1a] transition-colors">
                            <td className="py-4 font-bold">{w.match_count}-Match</td>
                            <td className="py-4 font-playfair text-2xl text-[#c9a84c]">
                              £{w.prize_amount?.toFixed(2)}
                            </td>
                            <td className="py-4">
                              <span className={`text-xs font-bold uppercase tracking-wider
                                               px-2 py-1 ${
                                w.status === 'paid'
                                  ? 'bg-emerald-900/30 text-emerald-400'
                                  : w.status === 'approved'
                                  ? 'bg-blue-900/30 text-blue-400'
                                  : w.status === 'rejected'
                                  ? 'bg-red-900/30 text-red-400'
                                  : 'bg-yellow-900/30 text-yellow-400'
                              }`}>
                                {w.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-10 border border-dashed border-[#1a4a2e]">
                      <p className="font-playfair text-xl text-[#4a5a4e]">No winnings yet</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <CharityPicker
                  charities={charities || []}
                  currentCharityId={user.charity_id}
                  currentPercentage={user.charity_percentage}
                />
                <div className="border border-[#1a4a2e] p-6">
                  <p className="text-[#c9a84c] text-xs tracking-[3px] uppercase mb-1">
                    Subscription
                  </p>
                  <h2 className="font-playfair text-2xl mb-6">My Plan</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-[#4a5a4e] uppercase tracking-wider mb-1">
                        Plan
                      </p>
                      <p className="font-bold capitalize">{user.subscription_plan || 'None'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#4a5a4e] uppercase tracking-wider mb-1">
                        Charity Contribution
                      </p>
                      <p className="font-playfair text-3xl text-[#c9a84c]">
                        {user.charity_percentage}%
                      </p>
                    </div>
                    <div className="pt-4 border-t border-[#1a4a2e]">
                      <p className="text-xs text-[#4a5a4e] uppercase tracking-wider mb-1">
                        Expires
                      </p>
                      <p className="text-sm">
                        {user.subscription_expiry
                          ? new Date(user.subscription_expiry).toLocaleDateString('en-GB', {
                              day: 'numeric', month: 'long', year: 'numeric'
                            })
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Proof upload component — inline since it's small
function ProofUploadSection({ resultId }) {
  return null // placeholder — handled by client component below
}