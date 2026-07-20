import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "Gallery" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Gallery"
      summary="This route is scaffolded and will be filled in the next build pass."
    />
  );
}
