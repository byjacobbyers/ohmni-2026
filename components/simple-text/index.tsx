'use client'

import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portable-text-components'

type SimpleTextProps = {
  content?: unknown
}

export default function SimpleText({ content }: SimpleTextProps) {
  if (!content || !Array.isArray(content) || content.length === 0) return null

  return (
    <PortableText
      value={content as Parameters<typeof PortableText>[0]['value']}
      components={portableTextComponents}
    />
  )
}
