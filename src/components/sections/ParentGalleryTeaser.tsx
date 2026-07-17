import Link from "next/link";
import { Lock, Download, CreditCard, Image as ImageIcon } from "lucide-react";

export default function ParentGalleryTeaser() {
  return (
    <section className="relative py-16 bg-gradient-to-br from-seafoam/20 via-white to-cream overflow-hidden">

      {/* Wave top */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 50" className="w-full" style={{ fill: "rgba(255,255,255,0.6)" }} preserveAspectRatio="none">
          <path d="M0,25 C480,50 960,0 1440,25 L1440,0 L0,0 Z" />
        </svg>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 50" className="w-full" style={{ fill: "#F8F5F0" }} preserveAspectRatio="none">
          <path d="M0,25 C480,0 960,50 1440,25 L1440,50 L0,50 Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-navy overflow-hidden grid grid-cols-1 md:grid-cols-2 items-center">

          {/* ── Left text panel ── */}
          <div className="p-8 md:p-12 space-y-6 relative overflow-hidden">

            {/* Background decorative circle */}
            <div
              className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-white/5 pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute top-0 right-0 w-40 h-40 rounded-full bg-seafoam/5 blur-2xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Private badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-seafoam text-[11px] font-bold tracking-widest uppercase">
              <Lock size={10} />
              Private &amp; Secure
            </div>

            <div>
              <p className="text-seafoam text-xs font-bold tracking-widest uppercase mb-3">Parent Portal</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-[1.1]">
                See What Your<br />Child Is Up To
              </h2>
            </div>

            <p className="text-white/65 leading-relaxed">
              Log in to your parent account to view and download photos of your child&apos;s day — art projects, outdoor play, storytime, and more. New photos added regularly by our staff.
            </p>

            {/* Mini testimonial */}
            <blockquote className="border-l-2 border-seafoam/40 pl-4 italic text-white/60 text-sm leading-relaxed">
              &ldquo;I love being able to check in and see my daughter smiling during circle time. It makes the day so much easier.&rdquo;
              <cite className="block not-italic text-seafoam/50 text-xs mt-1">— A Saltwater Sprouts Parent</cite>
            </blockquote>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/parent-portal/login"
                className="inline-flex items-center gap-2 bg-coral text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-coral/85 hover:-translate-y-0.5 transition-all duration-200 shadow-md"
              >
                <ImageIcon size={15} />
                View My Child&apos;s Photos
              </Link>
              <Link
                href="/parent-portal"
                className="border-2 border-white/25 text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200"
              >
                Parent Portal
              </Link>
            </div>
          </div>

          {/* ── Right visual panel — pinboard photo grid ── */}
          <div className="hidden md:flex items-center justify-center p-10">
            <div className="grid grid-cols-2 gap-4 w-full max-w-[300px]" style={{ gridTemplateRows: "auto auto" }}>

              {/* Featured card — spans 2 rows */}
              <div
                className="row-span-2 rounded-2xl overflow-hidden relative shadow-deep -rotate-1"
                style={{
                  background: "linear-gradient(135deg, rgba(184,212,206,0.35) 0%, rgba(91,138,90,0.25) 100%)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  minHeight: "200px",
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <ImageIcon size={22} className="text-seafoam/70" />
                  </div>
                  <span className="text-white/30 text-[10px] font-semibold tracking-widest uppercase">Art Projects</span>
                </div>
                {/* Decorative gradient sweep */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-navy/40 to-transparent" />
              </div>

              {/* Card 2 */}
              <div
                className="rounded-xl overflow-hidden relative shadow-card rotate-2"
                style={{
                  background: "linear-gradient(135deg, rgba(232,137,106,0.25) 0%, rgba(212,184,150,0.20) 100%)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  minHeight: "88px",
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <ImageIcon size={14} className="text-coral/60" />
                  </div>
                  <span className="text-white/25 text-[9px] font-semibold tracking-widest uppercase">Outdoor Play</span>
                </div>
              </div>

              {/* Card 3 */}
              <div
                className="rounded-xl overflow-hidden relative shadow-card -rotate-1"
                style={{
                  background: "linear-gradient(135deg, rgba(184,212,206,0.30) 0%, rgba(27,58,92,0.20) 100%)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  minHeight: "88px",
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <ImageIcon size={14} className="text-seafoam/60" />
                  </div>
                  <span className="text-white/25 text-[9px] font-semibold tracking-widest uppercase">Storytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Features strip ── */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              Icon: Lock,
              title: "Private & Secure",
              body: "Only you can see your child's photos. Login required.",
            },
            {
              Icon: Download,
              title: "Download Anytime",
              body: "Save full-resolution photos to your phone or computer.",
            },
            {
              Icon: CreditCard,
              title: "Pay Your Bill",
              body: "View your balance and pay tuition right from your portal.",
            },
          ].map((f) => {
            const { Icon } = f;
            return (
              <div key={f.title} className="bg-white rounded-2xl border border-seafoam/30 p-5 flex gap-4 items-start shadow-card">
                <div className="w-9 h-9 rounded-xl bg-seafoam/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={17} className="text-navy" />
                </div>
                <div>
                  <p className="font-bold text-navy text-sm">{f.title}</p>
                  <p className="text-navy/60 text-xs mt-1 leading-relaxed">{f.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
