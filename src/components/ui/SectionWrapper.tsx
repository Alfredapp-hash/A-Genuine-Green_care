interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  bg?: "white" | "cream" | "seafoam" | "navy";
}

const bgMap = {
  white:   "bg-white",
  cream:   "bg-cream",
  seafoam: "bg-seafoam/20",
  navy:    "bg-navy text-white",
};

export default function SectionWrapper({
  children,
  className = "",
  id,
  bg = "white",
}: SectionWrapperProps) {
  return (
    <section id={id} className={`py-16 md:py-24 ${bgMap[bg]} ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">{children}</div>
    </section>
  );
}
