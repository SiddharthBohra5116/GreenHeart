export default function GoalTracker() {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-32">
      <div className="bg-[#e1e3e2] rounded-[2rem] p-12 md:p-16 flex
                      flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/3">
          <h2 className="text-3xl font-headline font-extrabold
                         text-emerald-950 mb-4">
            Monthly Goal Tracker
          </h2>
          <p className="text-[#424940] font-medium leading-relaxed">
            Join us in reaching our milestone of £50k for charity
            this month. Every subscription helps.
          </p>
        </div>
        <div className="lg:w-2/3 w-full">
          <div className="flex justify-between items-end mb-4">
            <span className="text-4xl font-headline font-extrabold
                             text-emerald-950">85%</span>
            <span className="text-[#424940] font-bold">
              £42,500 / £50,000
            </span>
          </div>
          <div className="w-full h-8 bg-[#f2f4f3] rounded-full
                          overflow-hidden p-1 shadow-inner">
            <div className="h-full signature-gradient rounded-full
                            shadow-[0_0_20px_rgba(0,109,55,0.4)]
                            transition-all duration-1000"
              style={{width: '85%'}} />
          </div>
        </div>
      </div>
    </section>
  )
}