import Image from 'next/image'
import type { TeamMemberBlock } from '../../types'

export default function TeamMemberBlockRenderer({ block }: { block: TeamMemberBlock }) {
  const d = block.data
  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-start gap-6 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        {d.photo ? (
          <Image src={d.photo.url} alt={d.photo.alt} width={80} height={80} className="rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-2xl text-gray-400">👤</div>
        )}
        <div>
          <h3 className="text-lg font-bold" style={{ color: '#0d2b55' }}>{d.name}</h3>
          {d.role && <p className="text-sm font-medium mb-2" style={{ color: '#1d4ed8' }}>{d.role}</p>}
          {d.yearsExperience && <p className="text-xs text-gray-500 mb-2">{d.yearsExperience} years experience</p>}
          {d.bio && <p className="text-sm text-gray-700 leading-relaxed">{d.bio}</p>}
        </div>
      </div>
    </section>
  )
}
