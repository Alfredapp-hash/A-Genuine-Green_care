import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Child Photo Galleries | Admin" };

// TODO: replace with Supabase query
const MOCK_GALLERIES = [
  { childId: "child-001", childName: "Emma P.",  program: "Toddlers",    photoCount: 12, lastUpload: "2025-07-10" },
  { childId: "child-002", childName: "Liam S.",   program: "Infant Care", photoCount: 7,  lastUpload: "2025-07-09" },
  { childId: "child-003", childName: "Sofia R.",  program: "Waddlers",    photoCount: 4,  lastUpload: "2025-07-08" },
  { childId: "child-004", childName: "Noah K.",   program: "Preschool",   photoCount: 18, lastUpload: "2025-07-11" },
];

export default function AdminGalleriesPage() {
  const totalPhotos = MOCK_GALLERIES.reduce((s, g) => s + g.photoCount, 0);

  return (
    <div className="p-4 sm:p-8 max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Child Photo Galleries</h1>
          <p className="text-gray-400 text-sm mt-1">{totalPhotos} total photos across {MOCK_GALLERIES.length} children</p>
        </div>
        <Link
          href="/admin/galleries/upload"
          className="bg-sage text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-sage/85 transition-colors"
        >
          + Upload Photos
        </Link>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_GALLERIES.map((g) => (
          <div key={g.childId} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-seafoam/30 flex items-center justify-center font-bold text-navy">
                {g.childName[0]}
              </div>
              <div>
                <p className="font-bold text-navy text-sm">{g.childName}</p>
                <p className="text-gray-400 text-xs">{g.program}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{g.photoCount} photos</span>
              <span className="text-gray-400 text-xs">Last: {new Date(g.lastUpload).toLocaleDateString()}</span>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/admin/galleries/${g.childId}`}
                className="flex-1 text-center text-xs font-bold py-2 rounded-lg border-2 border-navy/15 text-navy hover:bg-navy/5 transition-colors"
              >
                Manage
              </Link>
              <Link
                href={`/admin/galleries/upload?child=${g.childId}`}
                className="flex-1 text-center text-xs font-bold py-2 rounded-lg bg-sage/10 text-sage border-2 border-sage/20 hover:bg-sage/20 transition-colors"
              >
                + Add Photos
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Info panel */}
      <div className="bg-seafoam/20 rounded-2xl border border-seafoam/40 p-5 text-sm text-navy/70 space-y-1">
        <p className="font-bold text-navy">📸 How parent photo access works</p>
        <p>Parents log in at <code className="bg-white px-1 rounded text-xs">/parent-portal</code> and see only photos tagged to their children.</p>
        <p>All photos are private — parents can view and download, but cannot see other families&apos; photos.</p>
        <p className="text-navy/50 text-xs mt-2">Storage: Supabase Storage (coming soon). Photos currently use placeholder URLs.</p>
      </div>
    </div>
  );
}
