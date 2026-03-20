import { getUserProfile } from '@/lib/getUserProfile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { redirect } from 'next/navigation'
import ScoreCard from '@/components/dashboard/ScoreCard'
import CharityPicker from '@/components/dashboard/CharityPicker'
import Link from 'next/link'
import ProofUpload from '@/components/dashboard/ProofUpload'

export default async function Dashboard() {
  const user = await getUserProfile()

  if (!user) redirect('/login')

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
    .select('prize_amount, status, match_count, created_at, matched_numbers')
    .eq('user_id', user.id)
    .gte('match_count', 3)
    .order('created_at', { ascending: false })

  // ✅ Fixed: .maybeSingle() instead of .single() — won't throw if no row
  const { data: latestDraw } = await supabaseAdmin
    .from('draws')
    .select('total_pool, carry_forward_amount, numbers, draw_month, status')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // ✅ Fixed: user.id instead of profile.id
  const { data: drawResult } = await supabaseAdmin
    .from('draw_results')
    .select('id, status, proof_url, match_count, prize_amount')
    .eq('user_id', user.id)
    .in('status', ['pending_verification', 'rejected'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const totalWon = winnings?.reduce(
    (sum, w) => sum + (w.prize_amount || 0), 0
  ) || 0

  const now = new Date()
  const nextDraw = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const daysLeft = Math.ceil((nextDraw - now) / (1000 * 60 * 60 * 24))

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const isActive = user.subscription_status === 'active'

  return (
    <div className="min-h-screen bg-[#f8faf9] font-body text-[#191c1c]">

      {/* ── NAV ── */}
      <nav className="fixed top-0 z-50 flex items-center justify-between
                      px-8 py-3 bg-white/60 backdrop-blur-xl rounded-full
                      mt-4 w-[95%] max-w-7xl border border-white/40
                      shadow-xl shadow-emerald-900/5"
           style={{left: '50%', transform: 'translateX(-50%)'}}>
        <Link href="/"
          className="text-2xl font-extrabold text-emerald-950 font-headline
                     tracking-tight">
          GreenHeart
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/"
            className="text-emerald-900/70 font-medium hover:text-emerald-600
                       transition-all text-sm">
            Home
          </Link>
          <Link href="/charities"
            className="text-emerald-900/70 font-medium hover:text-emerald-600
                       transition-all text-sm">
            Charities
          </Link>
          <span className="text-emerald-700 font-bold border-b-2
                           border-emerald-500 text-sm">
            Dashboard
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-[2px] rounded-full ${
              isActive
                ? 'bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-500'
                : 'bg-[#c1c9bd]'
            }`}>
              <div className="w-9 h-9 rounded-full bg-[#002e0b] flex items-center
                              justify-center text-white font-bold text-sm
                              font-headline border-2 border-white">
                {initials}
              </div>
            </div>
            <span className={`font-bold text-sm hidden md:block ${
              isActive ? 'text-amber-600' : 'text-[#424940]'
            }`}>
              {user.name?.split(' ')[0]}
              {isActive && (
                <span className="ml-1.5 text-[10px] font-black tracking-widest
                                 bg-amber-100 text-amber-700 px-2 py-0.5
                                 rounded-full uppercase">
                  PRO
                </span>
              )}
            </span>
          </div>

          <a href="/api/auth/logout"
            className="text-xs text-[#424940] hover:text-red-500
                       transition-colors font-medium">
            Logout
          </a>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">

        {/* ── INACTIVE BANNER ── */}
        {!isActive && (
          <div className="mb-8 rounded-[1.5rem] p-5 flex items-center
                          justify-between gap-4"
            style={{background:'linear-gradient(135deg,#002e0b,#0b4619)'}}>
            <div className="flex items-center gap-3 text-white">
              <span className="material-symbols-outlined text-[#6bfe9c]">
                lock
              </span>
              <p className="font-medium text-sm">
                Subscribe to unlock scores, draws and prizes
              </p>
            </div>
            <Link href="/pricing"
              className="bg-white text-[#002e0b] px-5 py-2 rounded-full
                         font-bold text-sm hover:bg-emerald-50 transition-colors
                         whitespace-nowrap">
              View Plans →
            </Link>
          </div>
        )}

        {/* ── WELCOME HEADER ── */}
        <header className="mb-12">
          <h1 className="font-headline text-5xl font-extrabold text-[#002e0b]
                         tracking-tight mb-2">
            Welcome back, {user.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-[#424940] text-lg">
            {isActive
              ? 'Your contributions are making a tangible difference today.'
              : 'Subscribe to start entering draws and supporting charities.'}
          </p>
        </header>

        {/* ── STATS BENTO ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
                        gap-6 mb-12">
          <div className="glass-panel p-8 rounded-[2rem] flex flex-col
                          justify-between min-h-[160px] shadow-xl
                          shadow-emerald-900/5">
            <span className="text-[#424940] font-medium text-sm">
              Draws Entered
            </span>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-4xl font-bold font-headline text-[#002e0b]">
                {participationCount || 0}
              </span>
              <span className="material-symbols-outlined text-[#006d37]"
                style={{fontVariationSettings:"'FILL' 1"}}>
                confirmation_number
              </span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2rem] flex flex-col
                          justify-between shadow-xl shadow-emerald-900/5">
            <span className="text-[#424940] font-medium text-sm">
              Total Won
            </span>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-4xl font-bold font-headline text-[#002e0b]">
                ₹{totalWon.toLocaleString('en-IN', {maximumFractionDigits:0})}
              </span>
              <span className="material-symbols-outlined text-[#006d37]"
                style={{fontVariationSettings:"'FILL' 1"}}>
                emoji_events
              </span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2rem] flex flex-col
                          justify-between shadow-xl shadow-emerald-900/5">
            <span className="text-[#424940] font-medium text-sm">
              Next Draw In
            </span>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-4xl font-bold font-headline text-[#002e0b]">
                {String(daysLeft).padStart(2, '0')}
              </span>
              <span className="text-[#424940] font-bold text-sm">DAYS</span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2rem] flex flex-col
                          justify-between shadow-xl shadow-emerald-900/5">
            <span className="text-[#424940] font-medium text-sm">
              Plan
            </span>
            <div className="flex items-end justify-between mt-4">
              <span className="text-3xl font-bold font-headline text-[#002e0b] capitalize">
                {user.subscription_plan || 'None'}
              </span>
              {isActive && (
                <span className="bg-[#9bf6b2] text-emerald-900 px-3 py-1
                                 rounded-full text-xs font-bold">
                  ACTIVE
                </span>
              )}
            </div>
            <span className="text-xs text-[#424940] mt-2">
              {user.subscription_expiry
                ? `Expires ${new Date(user.subscription_expiry)
                    .toLocaleDateString('en-GB')}`
                : 'Not subscribed'}
            </span>
          </div>
        </div>

        {/* ── PRIZE POOL BANNER ── */}
        {latestDraw && (
          <section className="rounded-[2rem] p-12 mb-12 relative overflow-hidden
                              text-white flex flex-col md:flex-row items-center
                              justify-between shadow-2xl"
            style={{background:'linear-gradient(135deg,#002e0b 0%,#0b4619 100%)'}}>
            <div className="absolute -right-20 -top-20 w-96 h-96
                            bg-[#006d37]/20 rounded-full blur-3xl
                            pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64
                            bg-emerald-400/10 rounded-full blur-3xl
                            pointer-events-none" />
            <div className="relative z-10 text-center md:text-left mb-8 md:mb-0">
              <h2 className="tracking-widest text-[#6bfe9c] font-bold mb-2
                             text-sm uppercase">
                Current Prize Pool
              </h2>
              <div className="text-6xl md:text-8xl font-headline font-extrabold
                              tracking-tighter">
                ₹{(
                  (latestDraw.total_pool || 0) +
                  (latestDraw.carry_forward_amount || 0)
                ).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="relative z-10 text-center">
              <p className="text-emerald-200 text-sm mb-3">
                Jackpot rollover
              </p>
              <p className="text-[#6bfe9c] font-headline font-extrabold text-3xl">
                +₹{(latestDraw.carry_forward_amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </section>
        )}

        {/* ── PROOF UPLOAD — shown when user has a result needing verification ── */}
        {drawResult && (
          <div className="mb-8">
            <ProofUpload
              resultId={drawResult.id}
              status={drawResult.status}
              proofUrl={drawResult.proof_url}
              onSuccess={() => window.location.replace('/dashboard')}
            />
          </div>
        )}

        {/* ── MAIN GRID ── */}
        {isActive ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT */}
            <div className="lg:col-span-7 space-y-8">

              {/* Score Entry */}
              <div className="glass-panel rounded-[2rem] p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-headline text-2xl font-extrabold
                                 text-[#002e0b]">
                    Your Entry Numbers
                  </h2>
                </div>

                {scores && scores.length > 0 && (
                  <div className="flex flex-wrap gap-4 mb-8">
                    {scores.map((s, i) => (
                      <div key={s.id}
                        className="w-14 h-14 rounded-full flex items-center
                                   justify-center font-bold text-xl"
                        style={{
                          background: i === 0
                            ? 'linear-gradient(135deg,#002e0b,#0b4619)'
                            : '#f2f4f3',
                          color: i === 0 ? 'white' : '#002e0b'
                        }}>
                        {s.score}
                      </div>
                    ))}
                  </div>
                )}

                <ScoreCard initialScores={scores || []} />
              </div>

              {/* Draw Results */}
              {latestDraw && (
                <div className="glass-panel rounded-[2rem] p-8 shadow-sm">
                  <h2 className="font-headline text-2xl font-extrabold
                                 text-[#002e0b] mb-6">
                    Last Draw Results
                  </h2>
                  <div className="bg-[#f2f4f3] rounded-[1.5rem] p-6 flex
                                  flex-col md:flex-row items-center
                                  justify-between gap-6">
                    <div className="flex flex-wrap gap-3">
                      {latestDraw.numbers?.map((n) => {
                        const userScoreVals = scores?.map(s => s.score) || []
                        const isMatch = userScoreVals.includes(n)
                        return (
                          <div key={n}
                            className="w-10 h-10 rounded-full flex items-center
                                       justify-center font-bold text-sm border-2"
                            style={{
                              backgroundColor: isMatch ? '#9bf6b2' : 'white',
                              borderColor: isMatch ? '#006d37' : '#c1c9bd',
                              color: isMatch ? '#00210c' : '#424940'
                            }}>
                            {n}
                          </div>
                        )
                      })}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#424940]
                                     uppercase tracking-widest mb-1">
                        Status
                      </p>
                      <span className="text-[#006d37] font-bold flex
                                       items-center gap-1">
                        <span className="material-symbols-outlined text-sm"
                          style={{fontVariationSettings:"'FILL' 1"}}>
                          check_circle
                        </span>
                        Draw {latestDraw.draw_month}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Winnings Table */}
              <div className="glass-panel rounded-[2rem] p-8 shadow-sm">
                <h2 className="font-headline text-2xl font-extrabold
                               text-[#002e0b] mb-6">
                  Recent Winnings
                </h2>
                {winnings && winnings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[#424940] text-xs uppercase
                                       tracking-widest border-b
                                       border-[#c1c9bd]/30">
                          <th className="pb-4 font-bold">Match</th>
                          <th className="pb-4 font-bold">Prize</th>
                          <th className="pb-4 font-bold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#c1c9bd]/10">
                        {winnings.map((w, i) => (
                          <tr key={i}>
                            <td className="py-4 font-medium">
                              {w.match_count}-Match
                            </td>
                            <td className="py-4 font-bold text-[#006d37]
                                           font-headline text-xl">
                              +₹{w.prize_amount?.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}
                            </td>
                            <td className="py-4 text-right">
                              <span className={`px-3 py-1 rounded-full text-xs
                                               font-bold ${
                                w.status === 'paid'
                                  ? 'bg-[#9bf6b2] text-emerald-900'
                                  : w.status === 'approved'
                                  ? 'bg-blue-100 text-blue-800'
                                  : w.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {w.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <span className="material-symbols-outlined text-4xl
                                     text-[#c1c9bd] block mb-3">
                      emoji_events
                    </span>
                    <p className="text-[#424940] text-sm">
                      No winnings yet — keep playing!
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT */}
            <div className="lg:col-span-5 space-y-8">

              <CharityPicker
                charities={charities || []}
                currentCharityId={user.charity_id}
                currentPercentage={user.charity_percentage}
              />

              {/* Plan Card */}
              <div className="glass-panel rounded-[2rem] p-8 shadow-sm">
                <h2 className="font-headline text-2xl font-extrabold
                               text-[#002e0b] mb-6">
                  Subscription Plan
                </h2>

                <div className="p-6 rounded-[1.5rem] text-white mb-6"
                  style={{background:'linear-gradient(135deg,#002e0b,#0b4619)'}}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl mb-1 capitalize">
                        {user.subscription_plan || 'None'} Plan
                      </h3>
                      <p className="text-emerald-300 text-xs uppercase
                                     tracking-widest font-bold">
                        GreenHeart Member
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[#6bfe9c]"
                      style={{fontVariationSettings:"'FILL' 1"}}>
                      verified_user
                    </span>
                  </div>
                  <div className="text-sm text-emerald-200 mb-4">
                    {user.subscription_expiry
                      ? `Renews on ${new Date(user.subscription_expiry)
                          .toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}`
                      : 'No active plan'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-headline font-extrabold">
                      {user.subscription_plan === 'yearly' ? '₹7,999' : '₹799'}
                    </span>
                    <span className="text-xs text-emerald-300">
                      {user.subscription_plan === 'yearly'
                        ? '/ year'
                        : '/ month'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    'Monthly draw entry',
                    '5-score rolling tracker',
                    `Charity contribution ${user.charity_percentage}%`,
                  ].map((f) => (
                    <div key={f}
                      className="flex items-center gap-3 text-sm text-[#424940]">
                      <span className="material-symbols-outlined text-[#006d37]
                                       text-lg">
                        check
                      </span>
                      {f}
                    </div>
                  ))}
                </div>

                <Link href="/pricing"
                  className="w-full py-4 rounded-full bg-[#eceeed]
                             text-[#002e0b] font-bold hover:bg-[#e6e9e8]
                             transition-colors text-center block text-sm">
                  Change Plan
                </Link>
              </div>

            </div>
          </div>
        ) : (
          /* Inactive — locked state */
          <div className="glass-panel rounded-[2rem] p-16 text-center
                          max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-5xl text-[#c1c9bd]
                             block mb-4">
              lock
            </span>
            <h3 className="font-headline text-3xl font-extrabold text-[#002e0b]
                           mb-4">
              Subscribe to Get Started
            </h3>
            <p className="text-[#424940] mb-8 leading-relaxed">
              Choose a plan to start entering scores, joining monthly draws,
              and supporting your favourite charity.
            </p>
            <Link href="/pricing"
              className="text-white px-10 py-4 rounded-full font-bold
                         inline-block hover:scale-105 transition-transform
                         shadow-xl"
              style={{background:'linear-gradient(135deg,#002e0b,#0b4619)'}}>
              View Plans →
            </Link>
          </div>
        )}

      </main>
    </div>
  )
}