import type { BlogPost, BlogBlock } from './types'
import { blockRegistry } from './blockRegistry'

function BlockRenderer({ block }: { block: BlogBlock }) {
  if (!block.enabled) return null
  const entry = blockRegistry[block.type]
  if (!entry) return null
  const Renderer = entry.renderer
  return <Renderer block={block} />
}

type Props = { post: BlogPost }

export default function BlogPostPreview({ post }: Props) {
  const enabledBlocks = post.blocks.filter((b) => b.enabled)

  return (
    <article className="bg-white min-h-screen">
      {enabledBlocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </article>
  )
}
