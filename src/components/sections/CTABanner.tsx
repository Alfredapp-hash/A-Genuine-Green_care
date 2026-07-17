import Button from "@/components/ui/Button";

export default function CTABanner() {
  return (
    <div className="relative bg-navy overflow-hidden py-24">

      {/* Dot-matrix texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      {/* Large decorative dashed circle */}
      <div
        className="absolute -right-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border-[2px] border-dashed border-white/8 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -left-40 top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-white/5 pointer-events-none"
        aria-hidden="true"
      />

      {/* Headline glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 80% at 50% 0%, rgba(184,212,206,0.07) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Multi-layer wave top */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none pointer-events-none" aria-hidden="true">
        {/* Ghost wave */}
        <svg
          viewBox="0 0 1440 70"
          className="w-full absolute top-0"
          style={{ fill: "rgba(184,212,206,0.08)" }}
          preserveAspectRatio="none"
        >
          <path d="M0,35 C320,70 640,0 960,35 C1120,53 1300,42 1440,35 L1440,0 L0,0 Z" />
        </svg>
        {/* Main wave */}
        <svg
          viewBox="0 0 1440 60"
          className="w-full relative"
          style={{ fill: "rgba(255,255,255,0.04)" }}
          preserveAspectRatio="none"
        >
          <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-7">
        <span className="inline-block text-seafoam text-xs font-bold tracking-widest uppercase">Ready to Begin?</span>

        <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.05] tracking-tight">
          Schedule a Tour &amp; Meet the Team
        </h2>

        <p className="text-white/65 text-lg leading-relaxed max-w-xl mx-auto">
          Come see why Georgetown County families trust Saltwater Sprouts. We&apos;d love to show you around and answer all your questions.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Button href="/contact" variant="primary">
            Schedule a Tour
          </Button>
          <Button
            href="/enrollment"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-navy"
          >
            Start Enrollment
          </Button>
        </div>

        {/* Phone nudge */}
        <p className="text-white/40 text-sm">
          or call us at{" "}
          <a href="tel:8430000000" className="text-white/60 hover:text-seafoam transition-colors font-medium">
            (843) 000-0000
          </a>
        </p>
      </div>
    </div>
  );
}
