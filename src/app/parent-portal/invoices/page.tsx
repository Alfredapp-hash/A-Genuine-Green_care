"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DEMO_SESSION, formatCents, type ParentSession } from "@/lib/parent-auth";
import { DEMO_INVOICES, type Invoice } from "@/lib/billing";

const STATUS_STYLES: Record<Invoice["status"], string> = {
  paid:    "bg-sage/15 text-sage",
  open:    "bg-sand/30 text-navy/70",
  overdue: "bg-coral/15 text-coral",
  partial: "bg-amber-100 text-amber-700",
};

export default function InvoicesPage() {
  const router = useRouter();
  const [session, setSession] = useState<ParentSession | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("sws_parent_session") : null;
    if (!raw) { router.push("/parent-portal/login"); return; }
    setSession(DEMO_SESSION);
  }, [router]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-navy text-white px-6 py-4 flex items-center justify-between">
        <Link href="/parent-portal">
          <span className="text-seafoam hover:text-white text-sm font-semibold">← Back to Portal</span>
        </Link>
        <p className="font-bold text-sm">Invoice History</p>
        <div className="w-24" />
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-extrabold text-navy mb-6">All Invoices</h1>

        <div className="bg-white rounded-2xl border border-seafoam/30 overflow-hidden">
          {DEMO_INVOICES.map((inv: Invoice, i: number) => (
            <div
              key={inv.id}
              className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-seafoam/20" : ""}`}
            >
              <div className="flex-1 min-w-0 mr-4">
                <p className="font-semibold text-navy text-sm truncate">{inv.description}</p>
                <p className="text-navy/50 text-xs mt-0.5">
                  Due {new Date(inv.dueDate).toLocaleDateString()}
                  {inv.paidAt && ` · Paid ${new Date(inv.paidAt).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <p className="font-bold text-navy">{formatCents(inv.amount)}</p>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[inv.status]}`}>
                  {inv.status}
                </span>
                {/* TODO: PDF download via Supabase or server-side PDF generation */}
                <button className="text-xs text-sage hover:underline font-semibold">PDF</button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-navy/40 text-center mt-6">
          Need a receipt or have a billing question?{" "}
          <Link href="/contact" className="text-sage hover:underline">Contact us</Link>
        </p>
      </div>
    </div>
  );
}
