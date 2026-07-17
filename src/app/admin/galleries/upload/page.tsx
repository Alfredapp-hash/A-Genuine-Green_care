"use client";

import { useState } from "react";
import Link from "next/link";

const MOCK_CHILDREN = [
  { id: "child-001", name: "Emma P.",  program: "Toddlers" },
  { id: "child-002", name: "Liam S.",  program: "Infant Care" },
  { id: "child-003", name: "Sofia R.", program: "Waddlers" },
  { id: "child-004", name: "Noah K.",  program: "Preschool" },
];

export default function UploadPhotosPage() {
  const [selectedChild, setSelectedChild] = useState("");
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done">("idle");

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedChild || !files?.length) return;
    setStatus("uploading");
    // TODO: upload each file to Supabase Storage under `child-photos/{childId}/{filename}`
    // then insert a row in `child_photos` table: { child_id, url, thumbnail_url, caption, taken_at }
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("done");
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/galleries" className="text-gray-400 hover:text-navy text-sm">← Galleries</Link>
        <h1 className="text-2xl font-bold text-navy">Upload Photos</h1>
      </div>

      {status === "done" ? (
        <div className="bg-sage/10 border-2 border-sage/30 rounded-2xl p-10 text-center space-y-4">
          <p className="text-4xl">✅</p>
          <p className="font-bold text-navy text-lg">Photos uploaded!</p>
          <p className="text-navy/60 text-sm">They&apos;re now visible to the parent(s) of the selected child.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setStatus("idle"); setFiles(null); setCaption(""); }}
              className="bg-sage text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-sage/85"
            >
              Upload More
            </button>
            <Link href="/admin/galleries" className="border-2 border-navy/20 text-navy font-bold px-5 py-2.5 rounded-full text-sm hover:bg-navy/5">
              View Galleries
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpload} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          {/* Child selector */}
          <div>
            <label className="block text-xs font-bold text-navy/60 uppercase tracking-wide mb-2">Child *</label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              required
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-sage"
            >
              <option value="">Select a child…</option>
              {MOCK_CHILDREN.map((c) => (
                <option key={c.id} value={c.id}>{c.name} — {c.program}</option>
              ))}
            </select>
          </div>

          {/* File picker */}
          <div>
            <label className="block text-xs font-bold text-navy/60 uppercase tracking-wide mb-2">
              Photos * {files && <span className="text-sage normal-case font-normal">({files.length} selected)</span>}
            </label>
            <div className="border-2 border-dashed border-seafoam/50 rounded-xl p-8 text-center">
              <p className="text-3xl mb-2">📷</p>
              <p className="text-navy/50 text-sm mb-3">Drag & drop or click to select</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFiles(e.target.files)}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer bg-sage/10 text-sage font-bold text-xs px-4 py-2 rounded-full border-2 border-sage/30 hover:bg-sage/20 transition-colors"
              >
                Choose Photos
              </label>
              {files && files.length > 0 && (
                <p className="mt-3 text-xs text-sage font-semibold">{files.length} photo{files.length !== 1 ? "s" : ""} selected</p>
              )}
              <p className="text-xs text-navy/30 mt-2">JPG, PNG, WEBP · Max 10MB each</p>
              <p className="text-xs text-coral/60 mt-1 font-semibold">⚠ Supabase Storage not yet connected — uploads are stubbed</p>
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-bold text-navy/60 uppercase tracking-wide mb-2">Caption (optional)</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Art time! · Storytime · Outdoor play"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-sage"
            />
          </div>

          <button
            type="submit"
            disabled={status === "uploading" || !selectedChild || !files?.length}
            className="w-full bg-sage text-white font-bold py-3 rounded-full hover:bg-sage/85 transition-colors text-sm disabled:opacity-50"
          >
            {status === "uploading" ? "Uploading…" : "Upload Photos"}
          </button>
        </form>
      )}
    </div>
  );
}
