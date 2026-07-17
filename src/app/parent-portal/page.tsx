"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Bell,
  Camera,
  CreditCard,
  FileText,
  ChevronRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { DEMO_SESSION, formatCents, type ParentSession } from "@/lib/parent-auth";
import { DEMO_INVOICES, getOpenBalance } from "@/lib/billing";

export default function ParentPortalDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<ParentSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: replace with Supabase session check
    const raw = typeof window !== "undefined" ? localStorage.getItem("sws_parent_session") : null;
    if (!raw) {
      router.push("/parent-portal/login");
      return;
    }
    // Stub: use demo session data
    setSession(DEMO_SESSION);
    setLoading(false);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("sws_parent_session");
    router.push("/parent-portal/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-navy/50 text-sm">Loading your account…</div>
      </div>
    );
  }

  if (!session) return null;

  const openBalance = getOpenBalance(DEMO_INVOICES);
  const openInvoices = DEMO_INVOICES.filter((i) => i.status === "open" || i.status === "overdue");
  const totalPhotos = session.children.reduce((s, c) => s + c.photoCount, 0);

  // Get initials from name
  const initials = session.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-cream">
      {/* ── Portal header ── */}
      <header className="bg-navy text-white px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Saltwater Sprouts"
              width={38}
              height={38}
              className="brightness-0 invert"
            />
          </Link>
          <div className="hidden sm:block">
            <p className="font-bold text-sm leading-tight">Parent Portal</p>
            <p className="text-seafoam/60 text-xs leading-tight">Saltwater Sprouts Early Learning Center</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification bell — static, no functionality yet */}
          <button
            className="relative w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-white/80" />
            {/* Badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-coral border-2 border-navy" />
          </button>

          {/* Avatar + name */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-seafoam/30 border-2 border-seafoam/50 flex items-center justify-center text-xs font-extrabold text-navy select-none">
              {initials}
            </div>
            <span className="text-white/70 text-xs hidden sm:block font-medium">{session.name}</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-seafoam hover:text-white transition-colors font-semibold ml-1 border border-white/10 hover:border-white/30 rounded-full px-3 py-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Sign Out</span>
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 space-y-8">

        {/* ── Balance alert ── */}
        {openBalance > 0 && (
          <div className="bg-white rounded-2xl border-2 border-coral/30 shadow-[0_4px_20px_rgba(232,137,106,0.12)] overflow-hidden">
            <div className="bg-gradient-to-r from-coral/10 to-sand/20 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-full bg-coral/15 flex items-center justify-center shrink-0 mt-0.5">
                  <CreditCard className="w-5 h-5 text-coral" />
                </div>
                <div>
                  <p className="font-extrabold text-navy text-lg leading-tight">
                    Balance Due:{" "}
                    <span className="text-coral">{formatCents(openBalance)}</span>
                  </p>
                  <p className="text-navy/55 text-sm mt-0.5">
                    {openInvoices.length} open invoice{openInvoices.length !== 1 ? "s" : ""}
                    {openInvoices.some((i) => i.status === "overdue") && (
                      <span className="ml-2 text-coral font-bold">· Payment overdue</span>
                    )}
                  </p>
                </div>
              </div>
              <Link
                href="/parent-portal/billing"
                className="bg-coral text-white font-bold px-6 py-2.5 rounded-full text-sm hover:bg-coral/85 active:scale-[0.97] transition-all shrink-0 shadow-[0_4px_12px_rgba(232,137,106,0.35)]"
              >
                Pay Now
              </Link>
            </div>
          </div>
        )}

        {/* ── Quick nav metric cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Photos card */}
          <Link
            href="/parent-portal/gallery"
            className="group bg-white rounded-2xl border border-sage/20 p-5 flex flex-col gap-3 hover:shadow-[0_8px_24px_rgba(91,138,90,0.15)] hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-sage/10 flex items-center justify-center">
                <Camera className="w-5 h-5 text-sage" />
              </div>
              <ChevronRight className="w-4 h-4 text-navy/20 group-hover:text-sage group-hover:translate-x-0.5 transition-all mt-1" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-navy leading-none">{totalPhotos}</p>
              <p className="font-bold text-navy/80 mt-1 text-sm">Child Photos</p>
              <p className="text-navy/45 text-xs mt-0.5">Click to view gallery</p>
            </div>
          </Link>

          {/* Billing card */}
          <Link
            href="/parent-portal/billing"
            className={`group bg-white rounded-2xl border p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition-all ${
              openBalance > 0
                ? "border-coral/30 hover:shadow-[0_8px_24px_rgba(232,137,106,0.15)]"
                : "border-seafoam/30 hover:shadow-[0_8px_24px_rgba(184,212,206,0.25)]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  openBalance > 0 ? "bg-coral/10" : "bg-seafoam/20"
                }`}
              >
                <CreditCard className={`w-5 h-5 ${openBalance > 0 ? "text-coral" : "text-sage"}`} />
              </div>
              <ChevronRight className="w-4 h-4 text-navy/20 group-hover:text-sage group-hover:translate-x-0.5 transition-all mt-1" />
            </div>
            <div>
              <p className={`text-3xl font-extrabold leading-none ${openBalance > 0 ? "text-coral" : "text-sage"}`}>
                {formatCents(openBalance)}
              </p>
              <p className="font-bold text-navy/80 mt-1 text-sm">Billing &amp; Payments</p>
              <p className="text-navy/45 text-xs mt-0.5">
                {openBalance > 0 ? `${openInvoices.length} invoice${openInvoices.length !== 1 ? "s" : ""} outstanding` : "All paid up!"}
              </p>
            </div>
          </Link>

          {/* Invoices card */}
          <Link
            href="/parent-portal/invoices"
            className="group bg-white rounded-2xl border border-sand/40 p-5 flex flex-col gap-3 hover:shadow-[0_8px_24px_rgba(212,184,150,0.2)] hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-sand/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-navy/60" />
              </div>
              <ChevronRight className="w-4 h-4 text-navy/20 group-hover:text-sage group-hover:translate-x-0.5 transition-all mt-1" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-navy leading-none">{DEMO_INVOICES.length}</p>
              <p className="font-bold text-navy/80 mt-1 text-sm">Invoice History</p>
              <p className="text-navy/45 text-xs mt-0.5">View all statements</p>
            </div>
          </Link>
        </div>

        {/* ── Children enrolled ── */}
        <div>
          <h2 className="font-extrabold text-navy text-xs uppercase tracking-widest mb-4">
            Your Children
          </h2>
          <div className="space-y-3">
            {session.children.map((child) => (
              <div
                key={child.id}
                className="bg-white rounded-2xl border border-seafoam/30 p-5 flex items-center justify-between gap-4 hover:shadow-[0_4px_16px_rgba(184,212,206,0.3)] transition-shadow overflow-hidden relative"
              >
                {/* Subtle wave decoration */}
                <div className="absolute right-0 bottom-0 w-24 h-24 opacity-[0.06] pointer-events-none">
                  <svg viewBox="0 0 96 96" className="w-full h-full fill-navy">
                    <path d="M0,48 C16,16 32,80 48,48 C64,16 80,80 96,48 L96,96 L0,96 Z" />
                  </svg>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-seafoam/40 to-sage/20 flex items-center justify-center text-2xl font-extrabold text-navy border-2 border-seafoam/30 shrink-0">
                    {child.name[0]}
                  </div>

                  <div>
                    <p className="font-extrabold text-navy text-base">{child.name}</p>
                    {/* Program badge pill */}
                    <span className="inline-block mt-1 text-xs font-bold text-sage bg-sage/10 rounded-full px-2.5 py-0.5">
                      {child.program}
                    </span>
                    <p className="text-navy/40 text-xs mt-1.5">
                      Enrolled since{" "}
                      {new Date(child.enrolledSince).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/parent-portal/gallery?child=${child.id}`}
                  className="flex items-center gap-1.5 text-xs font-bold text-sage hover:text-navy transition-colors shrink-0 relative z-10 bg-sage/10 hover:bg-sage/20 rounded-full px-3.5 py-2"
                >
                  <Camera className="w-3.5 h-3.5" />
                  {child.photoCount} photos
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent invoices preview ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-navy text-xs uppercase tracking-widest">Recent Invoices</h2>
            <Link href="/parent-portal/invoices" className="text-xs text-sage font-bold hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-seafoam/30 overflow-hidden shadow-[0_2px_12px_rgba(27,58,92,0.04)]">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-2.5 border-b border-seafoam/20 bg-seafoam/5">
              <span className="text-xs font-bold text-navy/40 uppercase tracking-wide">Description</span>
              <span className="text-xs font-bold text-navy/40 uppercase tracking-wide text-right">Amount</span>
              <span className="text-xs font-bold text-navy/40 uppercase tracking-wide text-right min-w-[64px]">Status</span>
            </div>
            {DEMO_INVOICES.slice(0, 3).map((inv, i) => (
              <div
                key={inv.id}
                className={`grid grid-cols-[1fr_auto_auto] gap-4 items-center px-5 py-4 ${
                  i > 0 ? "border-t border-seafoam/15" : ""
                } ${i % 2 === 1 ? "bg-seafoam/[0.03]" : ""}`}
              >
                <div>
                  <p className="text-navy font-semibold text-sm leading-tight">{inv.description}</p>
                  <p className="text-navy/45 text-xs mt-0.5">Due {new Date(inv.dueDate).toLocaleDateString()}</p>
                </div>
                <p className="font-bold text-navy text-sm text-right">{formatCents(inv.amount)}</p>
                <div className="flex justify-end">
                  {inv.status === "paid" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-sage/12 text-sage">
                      <CheckCircle className="w-3 h-3" />
                      Paid
                    </span>
                  ) : inv.status === "overdue" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-coral/12 text-coral">
                      <AlertCircle className="w-3 h-3" />
                      Overdue
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-sand/30 text-navy/60">
                      Open
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Portal footer ── */}
      <footer className="border-t border-seafoam/20 py-5 mt-4">
        <p className="text-center text-xs text-navy/35">
          Questions? Contact us ·{" "}
          <a href="tel:8435550100" className="hover:text-sage transition-colors font-medium">
            (843) XXX-XXXX
          </a>{" "}
          ·{" "}
          <Link href="/contact" className="hover:text-sage transition-colors">
            Send a message
          </Link>
        </p>
      </footer>
    </div>
  );
}
