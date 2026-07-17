"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Camera,
  Download,
  X,
  ChevronRight,
  Bell,
  LogOut,
} from "lucide-react";
import { DEMO_SESSION, DEMO_PHOTOS, type ParentSession, type ChildPhoto } from "@/lib/parent-auth";
import { Suspense } from "react";

// Unique gradient per card index
const CARD_GRADIENTS = [
  "from-seafoam/40 to-sage/20",
  "from-sage/20 to-seafoam/30",
  "from-navy/10 to-seafoam/25",
  "from-sand/30 to-seafoam/20",
  "from-seafoam/30 to-sand/20",
  "from-sage/15 to-navy/10",
  "from-coral/10 to-sand/20",
  "from-seafoam/50 to-sage/10",
];

function GalleryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childFilter = searchParams.get("child");

  const [session, setSession] = useState<ParentSession | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string>(childFilter ?? "all");
  const [lightbox, setLightbox] = useState<ChildPhoto | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  useEffect(() => {
    // TODO: replace with Supabase session
    const raw = typeof window !== "undefined" ? localStorage.getItem("sws_parent_session") : null;
    if (!raw) { router.push("/parent-portal/login"); return; }
    setSession(DEMO_SESSION);
    if (childFilter) setSelectedChildId(childFilter);
  }, [router, childFilter]);

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("sws_parent_session");
    }
    router.push("/parent-portal/login");
  }

  if (!session) return null;

  const visiblePhotos: ChildPhoto[] =
    selectedChildId === "all"
      ? DEMO_PHOTOS.filter((p) => session.children.some((c) => c.id === p.childId))
      : DEMO_PHOTOS.filter((p) => p.childId === selectedChildId);

  function openLightbox(photo: ChildPhoto) {
    const idx = visiblePhotos.findIndex((p) => p.id === photo.id);
    setLightboxIndex(idx);
    setLightbox(photo);
  }

  function lightboxPrev() {
    const newIdx = (lightboxIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
    setLightboxIndex(newIdx);
    setLightbox(visiblePhotos[newIdx]);
  }

  function lightboxNext() {
    const newIdx = (lightboxIndex + 1) % visiblePhotos.length;
    setLightboxIndex(newIdx);
    setLightbox(visiblePhotos[newIdx]);
  }

  function handleDownload(photo: ChildPhoto) {
    // TODO: replace with signed Supabase Storage URL download
    const link = document.createElement("a");
    link.href = photo.url;
    link.download = photo.filename;
    link.click();
  }

  const initials = session.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-cream">
      {/* ── Portal header (consistent with dashboard) ── */}
      <header className="bg-navy text-white px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/parent-portal" className="flex items-center gap-1.5 text-seafoam hover:text-white transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:block">Back to Portal</span>
          </Link>
          <div className="hidden sm:block w-px h-5 bg-white/15" />
          <div className="hidden sm:block">
            <p className="font-bold text-sm leading-tight">Photo Gallery</p>
            <p className="text-seafoam/60 text-xs leading-tight">Saltwater Sprouts Early Learning Center</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="relative w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-white/80" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-coral border-2 border-navy" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-seafoam/30 border-2 border-seafoam/50 flex items-center justify-center text-xs font-extrabold text-navy select-none">
              {initials}
            </div>
            <span className="text-white/70 text-xs hidden sm:block font-medium">{session.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-seafoam hover:text-white transition-colors font-semibold border border-white/10 hover:border-white/30 rounded-full px-3 py-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Sign Out</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-navy">My Child&apos;s Photos</h1>
            <p className="text-navy/50 text-sm mt-1">
              {visiblePhotos.length} photo{visiblePhotos.length !== 1 ? "s" : ""} — click any to view full size
            </p>
          </div>

          {/* Child filter tabs */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedChildId("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                selectedChildId === "all"
                  ? "bg-sage text-white shadow-sm"
                  : "bg-white border border-sage/30 text-sage hover:bg-sage/10"
              }`}
            >
              All Children
            </button>
            {session.children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  selectedChildId === child.id
                    ? "bg-sage text-white shadow-sm"
                    : "bg-white border border-sage/30 text-sage hover:bg-sage/10"
                }`}
              >
                {child.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Empty state ── */}
        {visiblePhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 gap-5">
            {/* Large camera icon outline */}
            <div className="w-28 h-28 rounded-3xl bg-seafoam/15 flex items-center justify-center">
              <Camera className="w-14 h-14 text-seafoam/40" strokeWidth={1} />
            </div>
            <div className="text-center">
              <p className="text-navy font-extrabold text-lg">No photos yet</p>
              <p className="text-navy/45 text-sm mt-1">Check back soon — we add new photos regularly!</p>
            </div>
            <Link
              href="/contact"
              className="mt-2 bg-sage text-white font-bold px-6 py-2.5 rounded-full text-sm hover:bg-sage/85 transition-colors"
            >
              Contact Center
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {visiblePhotos.map((photo, idx) => {
              const child = session.children.find((c) => c.id === photo.childId);
              const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
              return (
                <div
                  key={photo.id}
                  className="group relative rounded-2xl overflow-hidden aspect-square cursor-pointer hover:shadow-[0_8px_24px_rgba(27,58,92,0.16)] hover:-translate-y-0.5 transition-all border border-seafoam/20"
                  onClick={() => openLightbox(photo)}
                >
                  {/* Gradient photo placeholder */}
                  <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradient}`}>
                    {/* TODO: replace with real image */}
                    {/* <Image src={photo.url} alt={photo.caption ?? child?.name ?? ''} fill className="object-cover" /> */}
                    <Camera className="w-10 h-10 text-navy/25" strokeWidth={1.5} />
                  </div>

                  {/* Child initial badge */}
                  <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-navy/60 backdrop-blur-sm flex items-center justify-center text-white text-xs font-extrabold">
                    {child?.name[0]}
                  </div>

                  {/* Date badge */}
                  <div className="absolute bottom-2.5 left-2.5 bg-navy/60 backdrop-blur-sm rounded-lg px-2 py-0.5">
                    <p className="text-white/90 text-[10px] font-semibold">
                      {new Date(photo.takenAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>

                  {/* Hover overlay with caption + download */}
                  <div className="absolute inset-0 bg-navy/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                    <p className="text-white text-xs font-semibold text-center leading-snug">{photo.caption}</p>
                    <p className="text-seafoam text-xs">
                      {new Date(photo.takenAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownload(photo); }}
                      className="mt-1.5 flex items-center gap-1.5 bg-white text-navy text-xs font-bold px-3.5 py-1.5 rounded-full hover:bg-seafoam transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-[0_24px_64px_rgba(0,0,0,0.5)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-seafoam/20 bg-navy">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-seafoam/70" />
                <p className="text-white font-bold text-sm">
                  {session.children.find((c) => c.id === lightbox.childId)?.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-white/40 text-xs">
                  {lightboxIndex + 1} / {visiblePhotos.length}
                </p>
                <button
                  onClick={() => setLightbox(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Photo area */}
            <div className="relative bg-gradient-to-br from-seafoam/30 to-sage/15 aspect-video flex items-center justify-center">
              {/* TODO: <Image src={lightbox.url} alt={lightbox.caption ?? ''} fill className="object-contain" /> */}
              <Camera className="w-16 h-16 text-navy/20" strokeWidth={1} />

              {/* Navigation arrows */}
              {visiblePhotos.length > 1 && (
                <>
                  <button
                    onClick={lightboxPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-navy/60 hover:bg-navy/80 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                    aria-label="Previous photo"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                  <button
                    onClick={lightboxNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-navy/60 hover:bg-navy/80 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox footer */}
            <div className="px-5 py-4 flex items-center justify-between gap-4 bg-white">
              <div>
                <p className="font-bold text-navy text-sm">{lightbox.caption}</p>
                <p className="text-navy/45 text-xs mt-0.5">
                  {new Date(lightbox.takenAt).toLocaleDateString("en-US", { dateStyle: "long" })}
                </p>
              </div>
              <button
                onClick={() => handleDownload(lightbox)}
                className="flex items-center gap-1.5 bg-sage text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-sage/85 transition-colors shrink-0"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center text-navy/50 text-sm">Loading…</div>}>
      <GalleryContent />
    </Suspense>
  );
}
