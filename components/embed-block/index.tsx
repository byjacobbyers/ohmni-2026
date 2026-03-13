'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

type EmbedCodeValue =
  | string
  | { code?: string; language?: string }
  | null
  | undefined

function extractIframeSrc(html: string): string | null {
  if (!html || typeof html !== 'string') return null
  const match = html.match(/<iframe[^>]+src=["']([^"']+)["']/i)
  return match ? match[1] : null
}

function getCodeString(value: EmbedCodeValue): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'code' in value) {
    return typeof value.code === 'string' ? value.code : ''
  }
  return ''
}

type EmbedBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  embedCode?: EmbedCodeValue
  maxWidth?: string
}

export default function EmbedBlock({
  active = true,
  componentIndex = 0,
  anchor,
  embedCode,
  maxWidth = 'max-w-2xl',
}: EmbedBlockProps) {
  const iframeSrc = useMemo(() => {
    const code = getCodeString(embedCode)
    return extractIframeSrc(code)
  }, [embedCode])

  if (!active) return null
  if (!iframeSrc) return null

  return (
    <section
      id={anchor || `embed-block-${componentIndex}`}
      className="embed-block w-full flex justify-center px-5 py-12"
    >
      <motion.div
        className={`w-full ${maxWidth} mx-auto`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="relative w-full aspect-4/3 min-h-[300px] rounded-lg overflow-hidden border border-border">
          <iframe
            src={iframeSrc}
            title="Embedded content"
            className="absolute inset-0 w-full h-full"
            allowFullScreen
          />
        </div>
      </motion.div>
    </section>
  )
}
