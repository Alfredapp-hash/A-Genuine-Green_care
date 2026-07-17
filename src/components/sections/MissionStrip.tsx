export default function MissionStrip() {
  return (
    <section className="relative bg-navy overflow-hidden py-16 md:py-24">

      {/* Dot-pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Large decorative quotation mark */}
      <div
        className="absolute top-4 left-8 text-white/8 font-serif leading-none pointer-events-none select-none"
        style={{ fontSize: "180px", lineHeight: 1 }}
        aria-hidden="true"
      >
        &ldquo;
      </div>

      {/* Closing quote bottom-right */}
      <div
        className="absolute bottom-0 right-8 text-white/5 font-serif leading-none pointer-events-none select-none"
        style={{ fontSize: "140px", lineHeight: 1 }}
        aria-hidden="true"
      >
        &rdquo;
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">

        {/* Section label */}
        <p className="text-seafoam text-xs font-bold tracking-widest uppercase">Our Mission</p>

        {/* Mission quote */}
        <blockquote className="text-white text-xl md:text-2xl lg:text-3xl font-light leading-relaxed italic max-w-3xl mx-auto">
          &ldquo;To cultivate a safe, inclusive, and enriching environment where every child can grow, learn, and thrive — empowering children and strengthening families throughout Georgetown County and beyond.&rdquo;
        </blockquote>

        {/* Anchor divider */}
        <div className="flex items-center justify-center gap-4 py-2" aria-hidden="true">
          <div className="h-px flex-1 max-w-[80px] bg-seafoam/30" />
          <svg
            width="20"
            height="22"
            viewBox="0 0 20 22"
            fill="none"
            className="text-seafoam/50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="3" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            <line x1="10" y1="5.5" x2="10" y2="19" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2 10 Q10 14 18 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <line x1="2" y1="19" x2="18" y2="19" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <div className="h-px flex-1 max-w-[80px] bg-seafoam/30" />
        </div>

        {/* Founder attribution */}
        <div className="flex items-center justify-center gap-3">
          {/* Avatar circle */}
          <div className="w-10 h-10 rounded-full bg-sage/40 border-2 border-sage/60 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm tracking-tight">CT</span>
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">Courtney Thomas</p>
            <p className="text-seafoam/60 text-xs tracking-wide">Founder, Saltwater Sprouts ELC</p>
          </div>
        </div>
      </div>
    </section>
  );
}
