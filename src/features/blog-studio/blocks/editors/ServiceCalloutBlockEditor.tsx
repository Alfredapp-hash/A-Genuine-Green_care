'use client'
import { nanoid } from 'nanoid'
import type { ServiceCalloutBlock } from '../../types'

type Props = { block: ServiceCalloutBlock; onChange: (b: ServiceCalloutBlock) => void }

export default function ServiceCalloutBlockEditor({ block, onChange }: Props) {
  const d = block.data
  function update(patch: Partial<ServiceCalloutBlock['data']>) {
    onChange({ ...block, data: { ...d, ...patch } })
  }
  function updateService(idx: number, patch: Partial<ServiceCalloutBlock['data']['services'][0]>) {
    const services = d.services.map((s, i) => i === idx ? { ...s, ...patch } : s)
    update({ services })
  }
  function addService() {
    update({ services: [...d.services, { id: nanoid(), name: '' }] })
  }
  function removeService(idx: number) {
    update({ services: d.services.filter((_, i) => i !== idx) })
  }
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Heading <span className="text-red-500">*</span></label>
        <input type="text" value={d.heading} onChange={(e) => update({ heading: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="e.g. Our Marine Services" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Description <span className="font-normal text-gray-400">(optional)</span></label>
        <textarea rows={2} value={d.description ?? ''} onChange={(e) => update({ description: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
          placeholder="Brief description of your services..." />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Services</label>
          <button onClick={addService} className="text-xs text-blue-600 font-semibold hover:text-blue-800">+ Add Service</button>
        </div>
        <div className="space-y-2">
          {d.services.map((s, i) => (
            <div key={s.id} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50">
              <div className="flex gap-2">
                <input type="text" value={s.name} onChange={(e) => updateService(i, { name: e.target.value })}
                  className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Service name" />
                <button onClick={() => removeService(i)} className="text-gray-400 hover:text-red-500 text-xs px-2">✕</button>
              </div>
              <input type="text" value={s.description ?? ''} onChange={(e) => updateService(i, { description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Short description (optional)" />
              <input type="text" value={s.url ?? ''} onChange={(e) => updateService(i, { url: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="URL (optional, e.g. /services/oil-changes)" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">CTA Label</label>
          <input type="text" value={d.ctaLabel ?? ''} onChange={(e) => update({ ctaLabel: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="e.g. View All Services" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">CTA URL</label>
          <input type="text" value={d.ctaUrl ?? ''} onChange={(e) => update({ ctaUrl: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="/services" />
        </div>
      </div>
    </div>
  )
}
