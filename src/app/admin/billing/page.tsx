import type { Metadata } from "next";
import Link from "next/link";
import { DEMO_INVOICES, DEMO_PAYMENTS, getOpenBalance } from "@/lib/billing";
import { formatCents } from "@/lib/parent-auth";

export const metadata: Metadata = { title: "Billing Management | Admin" };

export default function AdminBillingPage() {
  const totalOpen = getOpenBalance(DEMO_INVOICES);
  const totalCollected = DEMO_PAYMENTS.reduce((s, p) => s + p.amount, 0);
  const openInvoices = DEMO_INVOICES.filter((i) => i.status === "open" || i.status === "overdue");

  return (
    <div className="p-4 sm:p-8 max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Billing Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage parent accounts, invoices, and payments</p>
        </div>
        <button className="bg-sage text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-sage/85 transition-colors">
          + New Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Outstanding Balance", value: formatCents(totalOpen), color: totalOpen > 0 ? "#ef4444" : "#10b981", sub: `${openInvoices.length} open invoices` },
          { label: "Collected This Month", value: formatCents(totalCollected), color: "#10b981", sub: `${DEMO_PAYMENTS.length} payments` },
          { label: "Families Enrolled", value: "4", color: "#1B3A5C", sub: "active accounts" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{s.label}</p>
            <p className="text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-gray-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Open invoices */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Open Invoices</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {openInvoices.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">All invoices paid ✅</div>
          ) : (
            openInvoices.map((inv, i) => (
              <div key={inv.id} className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                <div>
                  <p className="font-semibold text-navy text-sm">{inv.description}</p>
                  <p className="text-gray-400 text-xs">Due {new Date(inv.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-navy">{formatCents(inv.amount)}</p>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${inv.status === "overdue" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>
                    {inv.status}
                  </span>
                  {/* TODO: link to parent account */}
                  <button className="text-xs text-blue-600 hover:underline font-semibold">Send Reminder</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* All invoices */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">All Invoices</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {DEMO_INVOICES.map((inv, i) => (
            <div key={inv.id} className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-gray-100" : ""}`}>
              <div className="flex-1 min-w-0 mr-4">
                <p className="font-semibold text-navy text-sm truncate">{inv.description}</p>
                <p className="text-gray-400 text-xs">Due {new Date(inv.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <p className="font-bold text-navy">{formatCents(inv.amount)}</p>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                  inv.status === "paid" ? "bg-green-50 text-green-700"
                  : inv.status === "overdue" ? "bg-red-50 text-red-600"
                  : "bg-amber-50 text-amber-700"
                }`}>
                  {inv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <span className="font-bold">⚠ Stripe not yet connected.</span> Invoice creation, payment collection, and reminders require Supabase + Stripe integration. All data above is demo only.
      </div>
    </div>
  );
}
