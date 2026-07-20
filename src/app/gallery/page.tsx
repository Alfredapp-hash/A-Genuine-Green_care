import type { Metadata } from "next";
import { ProjectPanel } from "@/components/gallery/ProjectPanel";
import { DualCta } from "@/components/services/DualCta";
import { galleryProjects } from "@/data/gallery";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Project Gallery",
  description: `Before-and-after lawn care and landscaping results from ${site.name}.`,
};

export default function GalleryPage() {
  return (
    <>
      <section className="bg-forest-deep px-4 pb-14 pt-28 text-cream sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
            Gallery
          </p>
          <h1 className="font-display mt-3 max-w-2xl text-4xl font-semibold sm:text-5xl">
            Proof in the cut.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/75">
            Featured before-and-after work across maintenance, beds, cleanup, and commercial
            grounds. Replace these panels with job photos anytime.
          </p>
        </div>
      </section>

      <section className="bg-paper px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-14">
          {galleryProjects.map((project) => (
            <ProjectPanel key={project.id} project={project} />
          ))}
        </div>
      </section>

      <DualCta title="Want results like these on your property?" />
    </>
  );
}
