// components/home/HowItWorks.js

const steps = [
  {
    icon: 'subscriptions',
    title: 'Subscribe',
    desc: 'Pick monthly (₹799) or yearly (₹7,999). Choose a charity — at least 10% of your fee goes directly to them.',
  },
  {
    icon: 'sports_golf',
    title: 'Play',
    desc: 'Log your last 5 Stableford scores (1–45). New scores automatically replace the oldest.',
  },
  {
    icon: 'card_giftcard',
    title: 'Give & Win',
    desc: '5 numbers drawn monthly. Match 3, 4, or all 5 of your scores to win. Jackpot rolls over!',
  },
]

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-32">
      <div className="text-center mb-16">
        <span className="text-[#006d37] font-bold tracking-[0.3em]
                         uppercase text-sm">
          THE PROCESS
        </span>
        <h2 className="text-4xl md:text-5xl font-headline font-extrabold
                       text-emerald-950 mt-4 tracking-tight">
          Simple. Elegant. Impactful.
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-12">
        {steps.map((step) => (
          <div key={step.title} className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto glass-panel rounded-full
                            flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-4xl text-[#006d37]">
                {step.icon}
              </span>
            </div>
            <h3 className="text-2xl font-headline font-bold text-emerald-950">
              {step.title}
            </h3>
            <p className="text-[#424940] leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}