export default function AuthLeftPanel({ 
  title, 
  subtitle, 
  benefits = [] 
}) {
  return (
    <section className="relative w-full md:w-1/2 flex flex-col
                        justify-between p-8 md:p-16 lg:p-24
                        overflow-hidden min-h-[400px] md:min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0"
          style={{background: 'linear-gradient(135deg, #002e0b 0%, #0b4619 100%)'}} />
        <img
          src="https://images.unsplash.com/photo-1500930287596-c1ecaa373bb2?w=800"
          alt="Golf course"
          className="w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="absolute inset-0"
          style={{background: 'linear-gradient(to bottom, rgba(0,46,11,0.4), transparent, rgba(0,46,11,0.8))'}} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-16">
          <span className="material-symbols-outlined text-[#6bfe9c] text-4xl"
            style={{fontVariationSettings:"'FILL' 1"}}>eco</span>
          <span className="font-headline text-2xl font-extrabold
                           text-white tracking-tight">
            GreenHeart
          </span>
        </div>

        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl
                       text-white leading-[1.1] mb-12 max-w-lg">
          {title}
        </h1>

        {benefits.length > 0 && (
          <div className="flex flex-wrap gap-4 max-w-xl">
            {benefits.map((b) => (
              <div key={b.label}
                className="glass-panel px-6 py-3 rounded-full
                           flex items-center gap-3">
                <span className="material-symbols-outlined text-[#6bfe9c] text-sm">
                  {b.icon}
                </span>
                <span className="text-white font-medium text-sm">{b.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom quote */}
      <div className="relative z-10 mt-auto pt-12">
        <p className="text-white/60 italic text-lg max-w-md">
          {subtitle}
        </p>
      </div>
    </section>
  )
}