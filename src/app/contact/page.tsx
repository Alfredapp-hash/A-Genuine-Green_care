import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "Contact" };

export default function Page() {
  return (
    <PagePlaceholder
      title="Contact"
      summary="This route is scaffolded and will be filled in the next build pass."
    />
  );
}
