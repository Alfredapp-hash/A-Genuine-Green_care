// Billing stub — replace internals with Supabase + Stripe when ready.

export type Invoice = {
  id: string
  parentId: string
  description: string
  amount: number        // cents
  dueDate: string       // ISO date
  paidAt?: string
  status: 'open' | 'paid' | 'overdue' | 'partial'
}

export type PaymentRecord = {
  id: string
  parentId: string
  amount: number        // cents
  method: string
  paidAt: string
  invoiceId?: string
  stripePaymentIntentId?: string
}

// Demo data — replace with Supabase queries
export const DEMO_INVOICES: Invoice[] = [
  { id: 'inv-001', parentId: 'parent-001', description: 'Tuition – Emma – July 2025',   amount: 85000, dueDate: '2025-07-01', status: 'open' },
  { id: 'inv-002', parentId: 'parent-001', description: 'Tuition – Liam – July 2025',   amount: 72000, dueDate: '2025-07-01', status: 'open' },
  { id: 'inv-003', parentId: 'parent-001', description: 'Registration Fee – Liam',       amount: 10000, dueDate: '2025-01-01', paidAt: '2024-12-28', status: 'paid' },
  { id: 'inv-004', parentId: 'parent-001', description: 'Tuition – Emma – June 2025',   amount: 85000, dueDate: '2025-06-01', paidAt: '2025-05-29', status: 'paid' },
  { id: 'inv-005', parentId: 'parent-001', description: 'Activity Supply Fee – June',   amount: 2500,  dueDate: '2025-06-01', paidAt: '2025-05-29', status: 'paid' },
]

export const DEMO_PAYMENTS: PaymentRecord[] = [
  { id: 'pay-001', parentId: 'parent-001', amount: 87500, method: 'Visa ••••4242', paidAt: '2025-05-29', invoiceId: 'inv-004' },
  { id: 'pay-002', parentId: 'parent-001', amount: 10000, method: 'ACH Transfer',  paidAt: '2024-12-28', invoiceId: 'inv-003' },
]

export function getOpenBalance(invoices: Invoice[]): number {
  return invoices
    .filter((i) => i.status === 'open' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.amount, 0)
}
