"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  LogOut,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Lock,
  Loader2,
} from "lucide-react";
import { DEMO_SESSION, formatCents, type ParentSession } from "@/lib/parent-auth";
import { DEMO_INVOICES, DEMO_PAYMENTS, getOpenBalance, type Invoice } from "@/lib/billing";

export default function BillingPage() {
  const router = useRouter();
  const [session, setSession] = useState<ParentSession | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payStep, setPayStep] = useState<"idle" | "form" | "success">("idle");
  const [payProcessing, setPayProcessing] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("sws_parent_session") : null;
    if (!raw) { router.push("/parent-portal/login"); return; }
    setSession(DEMO_SESSION);
  }, [router]);

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("sws_parent_session");
    }
    router.push("/parent-portal/login");
  }

  if (!session) return null;

  const openInvoices = DEMO_INVOICES.filter((i) => i.status === "open" || i.status === "overdue");
  const openBalance = getOpenBalance(DEMO_INVOICES);
  const paidInvoices = DEMO_INVOICES.filter((i) => i.status === "paid");
  const totalPaid = paidInvoices.reduce((s, i) => s + i.amount, 0);
  const totalBilled = DEMO_INVOICES.reduce((s, i) => s + i.amount, 0);
  const paidPercent = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

  function toggleInvoice(id: string) {
    setSelectedInvoices((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const selectedTotal = openInvoices
    .filter((i) => selectedInvoices.includes(i.id))
    .reduce((s, i) => s + i.amount, 0);

  async function handlePay() {
    // TODO: create Stripe PaymentIntent via /api/parent/create-payment-intent
    setPayProcessing(true);
    await new Promise((r) => setTimeout(r, 1800));
    setPayProcessing(false);
    setPayStep("success");
  }

  const initials = session.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Suppress unused warning — payAmount is a controlled input kept for Stripe integration
  void payAmount;

  return (
    <div className="min-h-screen bg-cream">
      {/* ── Portal header (consistent) ── */}
      <header className="bg-navy text-white px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/parent-portal" className="flex items-center gap-1.5 text-seafoam hover:text-white transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:block">Back to Portal</span>
          </Link>
          <div className="hidden sm:block w-px h-5 bg-white/15" />
          <div className="hidden sm:block">
            <p className="font-bold text-sm leading-tight">Billing &amp; Payments</p>
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

      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10 space-y-6">

        {/* ── Balance card ── */}
        <div
          className={`rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(27,58,92,0.10)] ${
            openBalance > 0
              ? "border-2 border-coral/25"
              : "border-2 border-sage/25"
          }`}
        >
          <div
            className={`px-6 py-6 bg-gradient-to-br ${
              openBalance > 0
                ? "from-coral/10 via-white to-sand/15"
                : "from-sage/10 via-white to-seafoam/15"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-navy/50 mb-1">
                  Total Balance Due
                </p>
                <p
                  className={`text-4xl font-extrabold leading-none ${
                    openBalance > 0 ? "text-coral" : "text-sage"
                  }`}
                >
                  {formatCents(openBalance)}
                </p>
                <p className="text-navy/50 text-sm mt-2">
                  {openInvoices.length > 0
                    ? `${openInvoices.length} invoice${openInvoices.length !== 1 ? "s" : ""} outstanding`
                    : "You're all paid up!"}
                </p>
              </div>
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  openBalance > 0 ? "bg-coral/15" : "bg-sage/15"
                }`}
              >
                {openBalance > 0 ? (
                  <AlertCircle className="w-7 h-7 text-coral" />
                ) : (
                  <CheckCircle className="w-7 h-7 text-sage" />
                )}
              </div>
            </div>

            {/* Paid vs outstanding progress bar */}
            {totalBilled > 0 && (
              <div className="mt-5">
                <div className="flex justify-between text-xs text-navy/45 mb-1.5">
                  <span>Paid: {formatCents(totalPaid)}</span>
                  <span>{paidPercent}% paid</span>
                </div>
                <div className="h-2 bg-navy/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sage rounded-full transition-all"
                    style={{ width: `${paidPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Success state ── */}
        {payStep === "success" ? (
          <div className="bg-white rounded-2xl border-2 border-sage/30 p-10 text-center space-y-4 shadow-[0_4px_20px_rgba(91,138,90,0.10)]">
            <div className="w-16 h-16 rounded-full bg-sage/15 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-sage" />
            </div>
            <h2 className="text-xl font-extrabold text-navy">Payment Received!</h2>
            <p className="text-navy/55 text-sm">
              Thank you! A receipt will be emailed to{" "}
              <span className="font-semibold text-navy">{session.email}</span>.
            </p>
            <button
              onClick={() => { setPayStep("idle"); setSelectedInvoices([]); }}
              className="bg-sage text-white font-bold px-6 py-2.5 rounded-full hover:bg-sage/85 transition-colors text-sm mt-2"
            >
              Back to Billing
            </button>
          </div>
        ) : (
          <>
            {/* ── Open invoices table ── */}
            {openInvoices.length > 0 && (
              <div>
                <h2 className="font-extrabold text-navy text-xs uppercase tracking-widest mb-3">
                  Open Invoices
                </h2>
                <div className="bg-white rounded-2xl border border-seafoam/30 overflow-hidden shadow-[0_2px_12px_rgba(27,58,92,0.04)]">
                  {/* Table header */}
                  <div className="grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center px-5 py-2.5 border-b border-seafoam/20 bg-seafoam/5">
                    <div className="w-4" />
                    <span className="text-xs font-bold text-navy/40 uppercase tracking-wide">Description</span>
                    <span className="text-xs font-bold text-navy/40 uppercase tracking-wide text-right">Amount</span>
                    <span className="text-xs font-bold text-navy/40 uppercase tracking-wide text-right min-w-[56px]">Status</span>
                  </div>

                  {openInvoices.map((inv: Invoice, i: number) => (
                    <label
                      key={inv.id}
                      className={`grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center px-5 py-4 cursor-pointer hover:bg-seafoam/5 transition-colors ${
                        i > 0 ? "border-t border-seafoam/15" : ""
                      } ${i % 2 === 1 ? "bg-seafoam/[0.03]" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(inv.id)}
                        onChange={() => toggleInvoice(inv.id)}
                        className="w-4 h-4 accent-sage shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-navy text-sm leading-tight">{inv.description}</p>
                        <p className="text-navy/45 text-xs mt-0.5">
                          Due {new Date(inv.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="font-bold text-navy text-sm text-right shrink-0">
                        {formatCents(inv.amount)}
                      </p>
                      <div className="flex justify-end shrink-0">
                        {inv.status === "overdue" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-coral/12 text-coral">
                            <AlertCircle className="w-3 h-3" />
                            Overdue
                          </span>
                        ) : (
                          <span className="inline-flex text-xs font-bold px-2.5 py-1 rounded-full bg-sand/30 text-navy/60">
                            Open
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {/* Selected total + pay button */}
                {selectedInvoices.length > 0 && payStep === "idle" && (
                  <div className="mt-4 bg-white rounded-2xl border border-seafoam/30 p-5 shadow-[0_2px_12px_rgba(27,58,92,0.06)]">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-bold text-navy text-sm">
                        {selectedInvoices.length} invoice{selectedInvoices.length !== 1 ? "s" : ""} selected
                      </p>
                      <p className="font-extrabold text-coral text-xl">{formatCents(selectedTotal)}</p>
                    </div>
                    <button
                      onClick={() => setPayStep("form")}
                      className="w-full bg-coral text-white font-bold py-3 rounded-full hover:bg-coral/85 active:scale-[0.98] transition-all text-sm shadow-[0_4px_12px_rgba(232,137,106,0.35)]"
                    >
                      Pay {formatCents(selectedTotal)}
                    </button>
                  </div>
                )}

                {/* ── Payment form ── */}
                {payStep === "form" && (
                  <div className="mt-4 bg-white rounded-2xl border-2 border-sage/25 p-6 space-y-5 shadow-[0_4px_20px_rgba(91,138,90,0.10)]">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-navy">Payment Details</h3>
                      {/* Stripe badge */}
                      <div className="flex items-center gap-1.5 bg-navy/5 rounded-lg px-2.5 py-1.5">
                        <Lock className="w-3 h-3 text-navy/50" />
                        <span className="text-xs font-bold text-navy/50">Stripe</span>
                      </div>
                    </div>

                    {/* Card brand labels */}
                    <div className="flex gap-2">
                      {["Visa", "Mastercard", "Amex"].map((brand) => (
                        <span
                          key={brand}
                          className="text-xs font-bold text-navy/40 border border-navy/15 rounded-md px-2.5 py-1"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>

                    {/* TODO: Replace this with Stripe Elements (<CardElement />) */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-navy/50 uppercase tracking-widest block mb-1.5">
                          Card Number
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/25 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            className="w-full border-2 border-seafoam/40 rounded-xl pl-10 pr-4 py-3 text-sm text-navy focus:outline-none focus:border-sage transition-colors bg-white placeholder-navy/25"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-navy/50 uppercase tracking-widest block mb-1.5">
                            Expiry
                          </label>
                          <input
                            type="text"
                            placeholder="MM / YY"
                            className="w-full border-2 border-seafoam/40 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-sage transition-colors bg-white placeholder-navy/25"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-navy/50 uppercase tracking-widest block mb-1.5">
                            CVC
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full border-2 border-seafoam/40 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-sage transition-colors bg-white placeholder-navy/25"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-navy/[0.03] rounded-xl px-3.5 py-3 border border-navy/8">
                      <Lock className="w-3.5 h-3.5 text-navy/40 mt-0.5 shrink-0" />
                      <p className="text-xs text-navy/45 leading-relaxed">
                        Payments processed securely via Stripe. We never store card details.{" "}
                        <span className="text-coral font-bold">(Stripe integration pending)</span>
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handlePay}
                        disabled={payProcessing}
                        className="flex-1 bg-coral text-white font-bold py-3 rounded-full hover:bg-coral/85 active:scale-[0.98] transition-all text-sm disabled:opacity-60 flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(232,137,106,0.35)]"
                      >
                        {payProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing…
                          </>
                        ) : (
                          `Pay ${formatCents(selectedTotal)}`
                        )}
                      </button>
                      <button
                        onClick={() => setPayStep("idle")}
                        className="px-5 py-3 rounded-full border-2 border-navy/15 text-navy/55 text-sm hover:border-navy/30 hover:text-navy/80 transition-colors font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── All paid up ── */}
            {openInvoices.length === 0 && (
              <div className="bg-white rounded-2xl border border-seafoam/30 p-10 text-center shadow-[0_2px_12px_rgba(27,58,92,0.04)]">
                <div className="w-14 h-14 rounded-full bg-sage/15 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-7 h-7 text-sage" />
                </div>
                <p className="font-extrabold text-navy text-base">No open invoices</p>
                <p className="text-navy/45 text-sm mt-1">You&apos;re all paid up!</p>
              </div>
            )}
          </>
        )}

        {/* ── Payment history ── */}
        <div>
          <h2 className="font-extrabold text-navy text-xs uppercase tracking-widest mb-3">Recent Payments</h2>
          <div className="bg-white rounded-2xl border border-seafoam/30 overflow-hidden shadow-[0_2px_12px_rgba(27,58,92,0.04)]">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-2.5 border-b border-seafoam/20 bg-seafoam/5">
              <span className="text-xs font-bold text-navy/40 uppercase tracking-wide">Description</span>
              <span className="text-xs font-bold text-navy/40 uppercase tracking-wide text-right">Date</span>
              <span className="text-xs font-bold text-navy/40 uppercase tracking-wide text-right">Method</span>
              <span className="text-xs font-bold text-navy/40 uppercase tracking-wide text-right">Amount</span>
            </div>
            {DEMO_PAYMENTS.map((pay, i) => (
              <div
                key={pay.id}
                className={`grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4 ${
                  i > 0 ? "border-t border-seafoam/15" : ""
                } ${i % 2 === 1 ? "bg-seafoam/[0.03]" : ""}`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-sage/15 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-sage" />
                  </div>
                  <p className="font-semibold text-navy text-sm">Payment</p>
                </div>
                <p className="text-navy/50 text-xs text-right">
                  {new Date(pay.paidAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                </p>
                <p className="text-navy/60 text-xs text-right font-medium">{pay.method}</p>
                <p className="font-bold text-sage text-sm text-right">{formatCents(pay.amount)}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-navy/40 pb-2">
          Questions about your bill?{" "}
          <Link href="/contact" className="text-sage hover:underline font-semibold">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
