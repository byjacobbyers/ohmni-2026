'use client'

import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portable-text-components'

type NormalTextProps = {
  content?: unknown
}

export default function NormalText({ content }: NormalTextProps) {
  if (!content || !Array.isArray(content) || content.length === 0) return null

  return (
    <div className="rich-text">
      <PortableText
        value={content as Parameters<typeof PortableText>[0]['value']}
        components={portableTextComponents}
      />
    </div>
  )
}
