import Button from "@/components/ui/Button";

export default function CommunityStrip() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24" style={{ background: "rgba(184,212,206,0.25)" }}>

      {/* Radial center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(184,212,206,0.45) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Wave top */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 50" className="w-full" style={{ fill: "#ffffff" }} preserveAspectRatio="none">
          <path d="M0,25 C480,50 960,0 1440,25 L1440,0 L0,0 Z" />
        </svg>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 50" className="w-full" style={{ fill: "#ffffff" }} preserveAspectRatio="none">
          <path d="M0,25 C480,0 960,50 1440,25 L1440,50 L0,50 Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">

          {/* Left text block with anchor watermark */}
          <div className="relative max-w-xl flex-1">
            {/* Decorative anchor watermark */}
            <svg
              className="absolute -left-8 -top-8 opacity-[0.05] pointer-events-none select-none"
              width="160"
              height="180"
              viewBox="0 0 160 180"
              fill="#1B3A5C"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="80" cy="22" r="18" />
              <circle cx="80" cy="22" r="10" fill="rgba(184,212,206,0.1)" />
              <line x1="80" y1="40" x2="80" y2="148" stroke="#1B3A5C" strokeWidth="14" />
              <path d="M20 90 Q80 115 140 90" stroke="#1B3A5C" strokeWidth="12" fill="none" strokeLinecap="round"/>
              <line x1="20" y1="148" x2="140" y2="148" stroke="#1B3A5C" strokeWidth="14" strokeLinecap="round"/>
              <circle cx="20" cy="148" r="10" />
              <circle cx="140" cy="148" r="10" />
            </svg>

            <p className="text-sage text-xs font-bold tracking-widest uppercase mb-3">Community Rooted</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy leading-snug">
              Strengthening Georgetown County —<br className="hidden sm:block" /> One Family at a Time
            </h2>
            <p className="mt-4 text-navy/70 leading-relaxed">
              We partner with local organizations to connect families with financial assistance, parent support programs, and community resources. Because raising a child takes a village.
            </p>
            <div className="mt-6">
              <Button href="/community" variant="outline">
                Our Community Partners
              </Button>
            </div>
          </div>

          {/* Right slot — partner logo placeholder grid */}
          <div className="w-full md:w-auto flex-shrink-0">
            {/* ── SLOT: Insert community partner logos / resource grid here ── */}
            <div className="grid grid-cols-2 gap-3 min-w-[280px]">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-white/70 border border-seafoam/40 p-4 flex items-center justify-center shadow-card"
                >
                  <div className="w-full h-3 rounded bg-navy/8" />
                </div>
              ))}
            </div>
            <p className="text-center text-[10px] text-navy/30 font-medium mt-2 tracking-wide">
              Partner logos coming soon
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
