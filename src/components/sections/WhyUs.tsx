import { ShieldCheck, Heart, Sparkles, DollarSign } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";

const pillars = [
  {
    num: "01",
    Icon: ShieldCheck,
    title: "Safe",
    description:
      "Licensed, secured facilities with trained staff and rigorous health standards — because your child's safety is everything.",
    iconBg: "bg-navy",
    iconColor: "text-white",
  },
  {
    num: "02",
    Icon: Heart,
    title: "Inclusive",
    description:
      "Every child belongs here. We celebrate diversity and ensure all families feel welcomed, valued, and supported.",
    iconBg: "bg-coral",
    iconColor: "text-white",
  },
  {
    num: "03",
    Icon: Sparkles,
    title: "Enriching",
    description:
      "Play-based curriculum that sparks curiosity, creativity, and a lifelong love of learning from the very first days.",
    iconBg: "bg-sage",
    iconColor: "text-white",
  },
  {
    num: "04",
    Icon: DollarSign,
    title: "Affordable",
    description:
      "Quality early education shouldn't be out of reach. We offer sliding-scale rates, subsidies, and community partnerships.",
    iconBg: "bg-seafoam",
    iconColor: "text-navy",
  },
];

export default function WhyUs() {
  return (
    <SectionWrapper id="why-us" bg="white">
      <div className="text-center mb-16">
        <p className="text-coral text-xs font-bold tracking-widest uppercase mb-2">Why Saltwater Sprouts</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Built on Four Promises</h2>
        <p className="mt-3 text-navy/55 max-w-xl mx-auto leading-relaxed">
          Everything we do comes back to these four commitments to your family.
        </p>
      </div>

      {/* Pillar grid with connector line on desktop */}
      <div className="relative">

        {/* Horizontal connector line — desktop only, sits at icon center height */}
        <div
          className="hidden lg:block absolute top-[28px] left-[calc(12.5%)] right-[calc(12.5%)] h-px bg-navy/10 z-0"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {pillars.map((p) => {
            const { Icon } = p;
            return (
              <div key={p.title} className="relative text-center flex flex-col items-center gap-5 z-10">

                {/* Large ghost number behind card */}
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-8xl font-black text-navy/[0.04] leading-none select-none pointer-events-none"
                  aria-hidden="true"
                >
                  {p.num}
                </div>

                {/* Icon circle */}
                <div className={`relative w-14 h-14 rounded-2xl ${p.iconBg} flex items-center justify-center shadow-card z-10 flex-shrink-0`}>
                  <Icon size={24} className={p.iconColor} strokeWidth={2} />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-extrabold text-navy text-lg">{p.title}</h3>
                  <p className="text-navy/65 text-sm leading-relaxed max-w-[220px] mx-auto">{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
