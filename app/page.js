import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0f0a] text-[#f0ece0] overflow-hidden">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between
                      px-8 py-5 bg-[#0a0f0a]/90 backdrop-blur border-b border-[#1a4a2e]">
        <div className="font-playfair text-2xl tracking-widest text-[#c9a84c]">
          GREEN<span className="text-[#f0ece0]">HEART</span>
        </div>
        <div className="flex gap-8 items-center">
          <Link href="/charities"
            className="text-sm text-[#7a9e7e] hover:text-[#f0ece0] transition-colors tracking-wide">
            Charities
          </Link>
          <Link href="/login"
            className="text-sm text-[#7a9e7e] hover:text-[#f0ece0] transition-colors tracking-wide">
            Login
          </Link>
          <Link href="/signup"
            className="bg-[#c9a84c] text-[#0a0f0a] px-5 py-2 text-sm font-bold
                       tracking-widest uppercase hover:bg-[#b8943d] transition-colors">
            Join Now
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 pt-20">

        {/* Left — Emotional headline */}
        <div className="bg-[#0f2d1a] flex flex-col justify-center px-12 lg:px-20 py-20
                        relative overflow-hidden">
          {/* Background texture */}
          <div className="absolute inset-0 opacity-5"
            style={{backgroundImage: 'radial-gradient(circle at 30% 50%, #c9a84c 0%, transparent 60%)'}}>
          </div>

          <div className="relative z-10">
            <p className="text-[#c9a84c] text-xs font-bold tracking-[4px] uppercase mb-8
                          animate-fade-up">
              Golf · Win · Give Back
            </p>
            <h1 className="font-playfair text-6xl lg:text-8xl leading-[0.9] mb-8
                           animate-fade-up delay-100">
              Play Golf.<br/>
              <span className="text-[#c9a84c] italic">Change</span><br/>
              Lives.
            </h1>
            <p className="text-[#7a9e7e] text-lg leading-relaxed max-w-md mb-12
                          animate-fade-up delay-200">
              Enter your scores each month, compete in our prize draw, 
              and donate to a charity you love — all in one platform 
              built for golfers who care.
            </p>

            {/* Stats */}
            <div className="flex gap-10 mb-12 pb-12 border-b border-[#1a4a2e]
                            animate-fade-up delay-300">
              <div>
                <div className="font-playfair text-4xl text-[#c9a84c]">1,248</div>
                <div className="text-xs text-[#4a5a4e] uppercase tracking-wider mt-1">Members</div>
              </div>
              <div>
                <div className="font-playfair text-4xl text-[#c9a84c]">£36k</div>
                <div className="text-xs text-[#4a5a4e] uppercase tracking-wider mt-1">Donated</div>
              </div>
              <div>
                <div className="font-playfair text-4xl text-[#c9a84c]">£12k</div>
                <div className="text-xs text-[#4a5a4e] uppercase tracking-wider mt-1">Prize Pool</div>
              </div>
            </div>

            <div className="flex gap-4 animate-fade-up delay-400">
              <Link href="/signup"
                className="bg-[#c9a84c] text-[#0a0f0a] px-8 py-4 font-bold
                           tracking-widest uppercase text-sm hover:bg-[#b8943d] transition-colors">
                Start Playing →
              </Link>
              <Link href="/pricing"
                className="border border-[#1a4a2e] text-[#7a9e7e] px-8 py-4 text-sm
                           tracking-widest uppercase hover:border-[#c9a84c] hover:text-[#c9a84c]
                           transition-colors">
                View Plans
              </Link>
            </div>
          </div>
        </div>

        {/* Right — How it works */}
        <div className="bg-[#0d1a10] flex flex-col justify-center px-12 lg:px-16 py-20">
          <h2 className="font-playfair text-4xl mb-2 animate-fade-up">How It Works</h2>
          <div className="w-12 h-0.5 bg-[#c9a84c] mb-10 animate-fade-up delay-100"></div>

          {[
            {
              num: '01',
              title: 'Subscribe & Choose a Charity',
              desc: 'Pick monthly (£9.99) or yearly (£99). At least 10% of your fee goes directly to a charity you choose.'
            },
            {
              num: '02',
              title: 'Enter Your Golf Scores',
              desc: 'Log your last 5 Stableford scores (1–45). New scores automatically replace the oldest.'
            },
            {
              num: '03',
              title: 'Win the Monthly Draw',
              desc: '5 numbers drawn each month. Match 3, 4, or all 5 of your scores to win. Jackpot rolls over!'
            },
          ].map((step, i) => (
            <div key={step.num}
              className={`flex gap-6 mb-8 animate-fade-up`}
              style={{ animationDelay: `${(i + 2) * 0.1}s` }}>
              <div className="font-playfair text-5xl text-[#c9a84c] opacity-40 leading-none
                              flex-shrink-0 w-16">
                {step.num}
              </div>
              <div className="border-l border-[#1a4a2e] pl-6">
                <div className="font-bold text-[#f0ece0] mb-2">{step.title}</div>
                <div className="text-sm text-[#4a5a4e] leading-relaxed">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prize Pool Section */}
      <section className="bg-[#0f2d1a] py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#c9a84c] text-xs font-bold tracking-[4px] uppercase mb-4 text-center">
            Monthly Prize Draw
          </p>
          <h2 className="font-playfair text-5xl text-center mb-16">This Month's Prize Pool</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { match: '5-Number Match', pct: '40% of pool', amount: '£4,800', label: 'JACKPOT', rollover: true },
              { match: '4-Number Match', pct: '35% of pool', amount: '£4,200', label: 'SILVER', rollover: false },
              { match: '3-Number Match', pct: '25% of pool', amount: '£3,000', label: 'BRONZE', rollover: false },
            ].map((tier) => (
              <div key={tier.match}
                className="border border-[#1a4a2e] p-8 relative hover:border-[#c9a84c]
                           transition-colors group">
                {tier.rollover && (
                  <div className="absolute -top-3 left-6 bg-[#c9a84c] text-[#0a0f0a]
                                  text-xs font-bold px-3 py-1 tracking-widest">
                    JACKPOT
                  </div>
                )}
                <div className="text-[#4a5a4e] text-xs uppercase tracking-wider mb-2">
                  {tier.match}
                </div>
                <div className="font-playfair text-5xl text-[#c9a84c] mb-2">
                  {tier.amount}
                </div>
                <div className="text-[#7a9e7e] text-sm">{tier.pct}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/signup"
              className="bg-[#c9a84c] text-[#0a0f0a] px-10 py-4 font-bold
                         tracking-widest uppercase text-sm hover:bg-[#b8943d] transition-colors">
              Join the Draw →
            </Link>
          </div>
        </div>
      </section>

      {/* Charities Section */}
      <section className="py-24 px-8 bg-[#0a0f0a]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#c9a84c] text-xs font-bold tracking-[4px] uppercase mb-4">
            Making a Difference
          </p>
          <h2 className="font-playfair text-5xl mb-16">Charities We Support</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🌳', name: 'Plant a Future', cat: 'Environment', raised: '£12,450' },
              { icon: '❤️', name: 'Hearts & Holes', cat: 'Health', raised: '£8,200' },
              { icon: '⛳', name: 'Junior Golf Foundation', cat: 'Youth', raised: '£6,800' },
            ].map((c) => (
              <div key={c.name}
                className="bg-[#0f2d1a] border border-[#1a4a2e] p-8
                           hover:border-[#c9a84c] transition-colors group cursor-pointer">
                <div className="text-4xl mb-4">{c.icon}</div>
                <div className="text-xs text-[#7a9e7e] uppercase tracking-wider mb-2">{c.cat}</div>
                <div className="font-playfair text-2xl mb-3">{c.name}</div>
                <div className="text-[#c9a84c] text-sm font-bold">{c.raised} raised this month</div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link href="/charities"
              className="border border-[#1a4a2e] text-[#7a9e7e] px-8 py-3 text-sm
                         tracking-widest uppercase hover:border-[#c9a84c] hover:text-[#c9a84c]
                         transition-colors inline-block">
              View All Charities →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a4a2e] py-10 px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <div className="font-playfair text-xl text-[#c9a84c]">
            GREEN<span className="text-[#f0ece0]">HEART</span>
          </div>
          <div className="text-xs text-[#4a5a4e]">
            © 2026 GreenHeart. Built for Digital Heroes Selection Process.
          </div>
          <div className="flex gap-6 text-xs text-[#4a5a4e]">
            <Link href="/pricing" className="hover:text-[#c9a84c] transition-colors">Pricing</Link>
            <Link href="/charities" className="hover:text-[#c9a84c] transition-colors">Charities</Link>
            <Link href="/login" className="hover:text-[#c9a84c] transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}