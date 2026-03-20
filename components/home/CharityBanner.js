export default function CharityBanner() {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-32">
      <div className="signature-gradient rounded-[2rem] p-1.5 shadow-2xl">
        <div className="rounded-[1.8rem] py-12 px-8 md:px-16 flex flex-col
                        md:flex-row items-center justify-between gap-8
                        bg-white/10 backdrop-blur-md">
          <div className="text-center md:text-left">
            <p className="text-emerald-200 font-bold tracking-[0.2em]
                           text-sm uppercase mb-2">
              Total Contributions
            </p>
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold
                           text-white tracking-tighter">
              £36,200 RAISED
            </h2>
          </div>
          <div className="h-px md:h-16 w-32 md:w-px bg-white/20" />
          <div className="text-center md:text-right">
            <p className="text-emerald-200 font-bold tracking-[0.2em]
                           text-sm uppercase mb-2">
              Next Draw Jackpot
            </p>
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold
                           text-[#6bfe9c] tracking-tighter">
              £12,000
            </h2>
          </div>
        </div>
      </div>
    </section>
  )
}