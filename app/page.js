import Navbar from '@/components/home/Navbar'
import HeroSection from '@/components/home/HeroSection'
import CharityBanner from '@/components/home/CharityBanner'
import HowItWorks from '@/components/home/HowItWorks'
import PrizePool from '@/components/home/PrizePool'
import CharitiesSection from '@/components/home/CharitiesSection'
import GoalTracker from '@/components/home/GoalTracker'
import Footer from '@/components/home/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8faf9] overflow-hidden">
      <Navbar />
      <div className="pt-32">
        <HeroSection />
        <CharityBanner />
        <HowItWorks />
        <PrizePool />
        <CharitiesSection />
        <GoalTracker />
      </div>
      <Footer />
    </main>
  )
}