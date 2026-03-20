import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2
                        gap-16 items-center mb-24">
      {/* Left */}
      <div className="space-y-8">
        <span className="inline-block px-4 py-1.5 bg-[#9bf6b2]
                         text-emerald-900 rounded-full text-xs font-bold
                         tracking-widest uppercase">
          PHILANTHROPY IN EVERY SWING
        </span>
        <h1 className="text-6xl lg:text-7xl font-headline font-extrabold
                       text-emerald-950 leading-[1.05] tracking-tighter">
          GOLF WITH PURPOSE.<br/>
          <span className="text-[#006d37]">GRACEFUL GIVING.</span>
        </h1>
        <p className="text-xl text-[#424940] max-w-lg leading-relaxed font-medium">
          Experience the pinnacle of sport and altruism. Join an exclusive
          community turning fairways into fountains of change.
        </p>

        {/* Stats */}
        <div className="flex gap-10 py-6 border-y border-[#c1c9bd]/40">
          {[
            { val: '1,248', label: 'Members' },
            { val: '£36k',  label: 'Donated' },
            { val: '£12k',  label: 'Prize Pool' },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-headline font-extrabold text-3xl text-emerald-950">
                {s.val}
              </div>
              <div className="text-xs text-[#424940] uppercase tracking-wider mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
          <Link href="/signup"
            className="signature-gradient text-white px-8 py-4 rounded-full
                       font-bold shadow-xl shadow-emerald-900/20
                       hover:scale-105 transition-transform">
            Start Playing →
          </Link>
          <Link href="/pricing"
            className="glass-panel px-8 py-4 rounded-full font-bold
                       border border-white/40 hover:bg-white/80
                       transition-colors text-emerald-950">
            View Plans
          </Link>
        </div>
      </div>

      {/* Right — Image card */}
      <div className="relative group">
        <div className="aspect-[4/5] rounded-[2rem] overflow-hidden
                        glass-panel p-4 shadow-2xl">
          <div className="w-full h-full rounded-[1.5rem] overflow-hidden
                          relative bg-[#002e0b]">
            {/* Unsplash image — free to use */}
            <img
              src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800"
              alt="Golf course at sunrise"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t
                            from-[#002e0b]/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <div className="font-headline font-extrabold text-3xl">
                Play. Win.<br/>Give Back.
              </div>
            </div>
          </div>
        </div>

        {/* Floating stat card */}
        <div className="absolute -bottom-8 -left-8 glass-panel p-6
                        rounded-[1.5rem] shadow-2xl max-w-xs border border-white/40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#9bf6b2]
                            flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-900"
                style={{fontVariationSettings:"'FILL' 1"}}>eco</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#424940]
                             uppercase tracking-wider">
                Daily Impact
              </p>
              <p className="text-lg font-bold text-emerald-950">
                £36,200 Raised
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}