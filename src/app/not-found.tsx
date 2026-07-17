import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-seafoam/20 via-white to-cream flex items-center justify-center relative overflow-hidden">
      {/* Floating bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Bubble 1 */}
        <div
          className="absolute w-8 h-8 rounded-full border-2 border-seafoam/40 animate-float"
          style={{ left: "10%", top: "20%", animationDelay: "0s", animationDuration: "6s" }}
        />
        {/* Bubble 2 */}
        <div
          className="absolute w-5 h-5 rounded-full border-2 border-sage/30 animate-float"
          style={{ left: "20%", top: "60%", animationDelay: "1s", animationDuration: "7s" }}
        />
        {/* Bubble 3 */}
        <div
          className="absolute w-12 h-12 rounded-full border-2 border-seafoam/25 animate-float"
          style={{ left: "75%", top: "15%", animationDelay: "0.5s", animationDuration: "8s" }}
        />
        {/* Bubble 4 */}
        <div
          className="absolute w-6 h-6 rounded-full border-2 border-coral/25 animate-float"
          style={{ left: "85%", top: "55%", animationDelay: "2s", animationDuration: "5.5s" }}
        />
        {/* Bubble 5 */}
        <div
          className="absolute w-10 h-10 rounded-full border-2 border-sand/40 animate-float"
          style={{ left: "50%", top: "10%", animationDelay: "1.5s", animationDuration: "9s" }}
        />
        {/* Bubble 6 */}
        <div
          className="absolute w-4 h-4 rounded-full bg-seafoam/20 animate-float"
          style={{ left: "30%", top: "80%", animationDelay: "3s", animationDuration: "6.5s" }}
        />
        {/* Bubble 7 */}
        <div
          className="absolute w-7 h-7 rounded-full bg-sage/10 animate-float"
          style={{ left: "60%", top: "75%", animationDelay: "0.8s", animationDuration: "7.5s" }}
        />
        {/* Bubble 8 */}
        <div
          className="absolute w-3 h-3 rounded-full bg-coral/20 animate-float"
          style={{ left: "90%", top: "30%", animationDelay: "2.5s", animationDuration: "5s" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-xl mx-auto">
        {/* Large 404 watermark */}
        <div className="relative inline-block w-full">
          <span
            className="block font-extrabold text-navy/10 select-none leading-none"
            style={{ fontSize: "clamp(80px, 20vw, 140px)", fontFamily: "var(--font-nunito)" }}
          >
            404
          </span>

          {/* Sea turtle over the watermark */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* CSS sea turtle — rounded shapes in sage */}
            <div className="relative animate-bob" style={{ animationDuration: "4s" }}>
              {/* Shell body */}
              <div className="relative w-20 h-16 rounded-full bg-gradient-to-br from-sage to-sage/70 flex items-center justify-center shadow-elevated">
                {/* Shell pattern */}
                <div className="w-12 h-10 rounded-full border-2 border-white/30" />
                <div className="absolute w-3 h-3 rounded-full border border-white/30 top-3 left-4" />
                <div className="absolute w-3 h-3 rounded-full border border-white/30 top-3 right-4" />
                <div className="absolute w-4 h-3 rounded-full border border-white/30 bottom-3" />
              </div>
              {/* Head */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-7 rounded-full bg-sage/80 flex items-center justify-center">
                {/* Eyes */}
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-navy/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-navy/60" />
                </div>
              </div>
              {/* Front flippers */}
              <div className="absolute top-2 -left-6 w-7 h-4 rounded-full bg-sage/60 rotate-[-20deg]" />
              <div className="absolute top-2 -right-6 w-7 h-4 rounded-full bg-sage/60 rotate-[20deg]" />
              {/* Back flippers */}
              <div className="absolute -bottom-2 left-1 w-5 h-3 rounded-full bg-sage/50 rotate-[30deg]" />
              <div className="absolute -bottom-2 right-1 w-5 h-3 rounded-full bg-sage/50 rotate-[-30deg]" />
              {/* Tail */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3 h-4 rounded-b-full bg-sage/50" />
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-navy leading-tight">
          Looks like this page swam away
        </h1>

        {/* Subtext */}
        <p className="mt-4 text-navy/60 text-lg leading-relaxed max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to shore.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-coral text-white font-bold text-sm hover:bg-coral/85 transition-all shadow-md hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
          >
            Go Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-navy text-navy font-bold text-sm hover:bg-navy hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
          >
            Contact Us
          </Link>
        </div>

        {/* Wave decoration at bottom */}
        <div className="mt-12 text-seafoam/40">
          <svg viewBox="0 0 200 30" className="w-40 mx-auto" fill="currentColor">
            <path d="M0,15 C25,5 50,25 75,15 C100,5 125,25 150,15 C175,5 187,20 200,15 L200,30 L0,30 Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
