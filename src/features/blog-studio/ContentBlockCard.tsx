'use client'
import { useState } from 'react'
import type { BlogBlock } from './types'
import { blockRegistry } from './blockRegistry'
import { FRIENDLY_BLOCK_LABELS } from './friendlyLabels'

type Props = {
  block: BlogBlock
  index: number
  total: number
  onChange: (b: BlogBlock) => void
  onDelete: () => void
  onDuplicate: () => void
  onMove: (dir: 'up' | 'down') => void
}

function getPreviewText(block: BlogBlock): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = (block as any).data
  if (!d) return ''
  if (d.text) return d.text
  if (d.title) return d.title
  if (d.body) return String(d.body).slice(0, 80)
  if (d.headline) return d.headline
  if (d.heading) return d.heading
  if (d.question) return d.question
  if (d.quote) return `"${String(d.quote).slice(0, 60)}…"`
  if (d.url) return d.url
  if (d.label) return d.label
  if (d.items?.length) return `${d.items.length} item${d.items.length !== 1 ? 's' : ''}`
  if (d.steps?.length) return `${d.steps.length} step${d.steps.length !== 1 ? 's' : ''}`
  if (d.services?.length) return `${d.services.length} service${d.services.length !== 1 ? 's' : ''}`
  return ''
}

export default function ContentBlockCard({ block, index, total, onChange, onDelete, onDuplicate, onMove }: Props) {
  const [collapsed, setCollapsed] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const entry = blockRegistry[block.type]
  if (!entry) return null

  const Editor = entry.editor
  const friendlyLabel = FRIENDLY_BLOCK_LABELS[block.type] ?? entry.label
  const preview = getPreviewText(block)

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-all ${
        block.enabled
          ? 'border-gray-200 bg-white shadow-sm hover:shadow-md'
          : 'border-dashed border-gray-200 bg-gray-50 opacity-60'
      }`}
    >
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Drag handle visual */}
        <div className="flex flex-col gap-0.5 opacity-30 cursor-grab">
          <span className="block w-3 h-0.5 bg-gray-400 rounded" />
          <span className="block w-3 h-0.5 bg-gray-400 rounded" />
          <span className="block w-3 h-0.5 bg-gray-400 rounded" />
        </div>

        {/* Icon + label */}
        <span className="text-base">{entry.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-800">{block.internalLabel || friendlyLabel}</p>
          {preview && collapsed && (
            <p className="text-xs text-gray-400 truncate mt-0.5">{preview}</p>
          )}
        </div>

        {/* Visible toggle */}
        <label className="flex items-center gap-1.5 cursor-pointer shrink-0" title={block.enabled ? 'Visible' : 'Hidden'}>
          <div
            className={`w-8 h-4 rounded-full transition-colors relative ${block.enabled ? 'bg-[#0d2b55]' : 'bg-gray-200'}`}
            onClick={() => onChange({ ...block, enabled: !block.enabled })}
          >
            <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${block.enabled ? 'left-4' : 'left-0.5'}`} />
          </div>
        </label>

        {/* Action buttons */}
        <div className="flex items-center gap-1 border-l border-gray-100 pl-2 shrink-0">
          <button
            onClick={() => onMove('up')}
            disabled={index === 0}
            title="Move up"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-20 transition-colors text-xs"
          >↑</button>
          <button
            onClick={() => onMove('down')}
            disabled={index === total - 1}
            title="Move down"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-20 transition-colors text-xs"
          >↓</button>
          <button
            onClick={onDuplicate}
            title="Duplicate"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors text-xs"
          >⧉</button>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              title="Delete"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors text-xs"
            >✕</button>
          ) : (
            <div className="flex items-center gap-1">
              <button onClick={onDelete} className="text-xs px-2 py-1 rounded bg-red-500 text-white font-bold hover:bg-red-600 transition-colors">Delete</button>
              <button onClick={() => setConfirmDelete(false)} className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Keep</button>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Edit section' : 'Collapse'}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#0d2b55] hover:bg-blue-50 transition-colors text-xs"
          >
            {collapsed ? '✏️' : '▲'}
          </button>
        </div>
      </div>

      {/* Expanded editor */}
      {!collapsed && (
        <div className="border-t border-gray-100">
          <div className="p-4">
            <Editor block={block} onChange={onChange} />
          </div>
          <div className="px-4 pb-3 flex justify-end">
            <button
              onClick={() => setCollapsed(true)}
              className="text-xs text-gray-400 hover:text-gray-700 font-semibold"
            >
              ▲ Collapse
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
