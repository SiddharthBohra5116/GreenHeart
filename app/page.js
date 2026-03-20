import Navbar from '@/components/home/Navbar'
import HeroSection from '@/components/home/HeroSection'
import CharityBanner from '@/components/home/CharityBanner'
import HowItWorks from '@/components/home/HowItWorks'
import PrizePool from '@/components/home/PrizePool'
import CharitiesSection from '@/components/home/CharitiesSection'
import GoalTracker from '@/components/home/GoalTracker'
import Footer from '@/components/home/Footer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function Home() {

  const { count: totalUsers } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active')

  const { data: donationData } = await supabaseAdmin
    .from('donations')
    .select('amount')

  const totalDonated = donationData
    ? donationData.reduce((sum, d) => sum + (d.amount || 0), 0)
    : 0

  const { data: latestDraw } = await supabaseAdmin
    .from('draws')
    .select('total_pool, carry_forward_amount')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const prizePool = latestDraw
    ? (latestDraw.total_pool || 0) + (latestDraw.carry_forward_amount || 0)
    : 0

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const { data: monthlyData } = await supabaseAdmin
    .from('donations')
    .select('amount')
    .gte('created_at', monthStart.toISOString())

  const monthlyRaised = monthlyData
    ? monthlyData.reduce((sum, d) => sum + (d.amount || 0), 0)
    : 0

  const MONTHLY_GOAL = 500000
  const goalPercent = Math.min(
    Math.round((monthlyRaised / MONTHLY_GOAL) * 100),
    100
  )

  return (
    <main className="min-h-screen bg-[#f8faf9] overflow-hidden">
      <Navbar />
      <div className="pt-32">
        <HeroSection
          totalUsers={totalUsers || 0}
          totalDonated={totalDonated}
          prizePool={prizePool}
        />
        {/* Fixed: pass live data instead of hardcoded strings */}
        <CharityBanner totalDonated={totalDonated} prizePool={prizePool} />
        <HowItWorks />
        <PrizePool latestDraw={latestDraw} />
        <CharitiesSection />
        <GoalTracker
          monthlyRaised={monthlyRaised}
          monthlyGoal={MONTHLY_GOAL}
          goalPercent={goalPercent}
          totalDonated={totalDonated}
        />
      </div>
      <Footer />
    </main>
  )
}