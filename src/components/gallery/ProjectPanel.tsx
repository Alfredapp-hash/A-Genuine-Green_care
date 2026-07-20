import type { GalleryProject } from "@/data/gallery";

const toneClass: Record<GalleryProject["tone"], string> = {
  morning:
    "from-[#2f6b45] via-[#4a8f5c] to-[#c4a35a]/40",
  midday: "from-[#1a3d2b] via-[#2f6b45] to-[#e2c987]/35",
  dusk: "from-[#0f2419] via-[#1a3d2b] to-[#c4a35a]/30",
};

export function ProjectPanel({ project }: { project: GalleryProject }) {
  return (
    <article className="border-t border-forest/15 pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-leaf">
            {project.service} · {project.location}
          </p>
          <h2 className="font-display mt-2 text-2xl font-semibold text-ink">{project.title}</h2>
        </div>
      </div>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-charcoal/70">{project.summary}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <figure>
          <div
            className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${toneClass[project.tone]} opacity-80`}
          >
            <div className="absolute inset-0 hero-grass-texture opacity-60" />
            <span className="absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-[0.14em] text-cream/90">
              Before
            </span>
          </div>
          <figcaption className="mt-2 text-sm text-charcoal/65">{project.beforeLabel}</figcaption>
        </figure>
        <figure>
          <div
            className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${toneClass[project.tone]}`}
          >
            <div className="absolute inset-0 hero-grass-texture" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-forest-deep/50 to-transparent" />
            <span className="absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-[0.14em] text-cream">
              After
            </span>
          </div>
          <figcaption className="mt-2 text-sm text-charcoal/65">{project.afterLabel}</figcaption>
        </figure>
      </div>
    </article>
  );
}
