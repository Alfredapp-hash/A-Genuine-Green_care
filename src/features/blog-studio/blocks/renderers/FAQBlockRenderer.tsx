'use client'
import { useState } from 'react'
import type { FAQBlock } from '../../types'

export default function FAQBlockRenderer({ block }: { block: FAQBlock }) {
  const d = block.data
  const [open, setOpen] = useState<string | null>(null)
  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      {d.heading && <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: '#0d2b55', fontFamily: 'var(--font-display), Georgia, serif' }}>{d.heading}</h2>}
      <div className="space-y-2">
        {d.items.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === item.id ? null : item.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-sm text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <span>{item.question}</span>
              <span className="text-gray-400 ml-4">{open === item.id ? '−' : '+'}</span>
            </button>
            {open === item.id && (
              <div className="px-5 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
