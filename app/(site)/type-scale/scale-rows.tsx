'use client'

import { useEffect, useRef, useState } from 'react'

// Single source of truth: the --text-* vars emitted by @theme in globals.css.
// Values shown are computed live, so they track responsive overrides too.
const SCALE_KEYS = ['display', 'h1', 'h2', 'h3', 'h4', 'body-lg', 'body', 'small'] as const

function ScaleRow({ scaleKey }: { scaleKey: (typeof SCALE_KEYS)[number] }) {
  const sampleRef = useRef<HTMLDivElement>(null)
  const [meta, setMeta] = useState('')

  useEffect(() => {
    if (!sampleRef.current) return
    const s = getComputedStyle(sampleRef.current)
    setMeta(
      `size: ${s.fontSize} | lineHeight: ${s.lineHeight} | letterSpacing: ${s.letterSpacing} | fontWeight: ${s.fontWeight}`
    )
  }, [])

  return (
    <section className="border rounded-lg p-4">
      <div className="flex flex-col gap-2 mb-3">
        <div className="text-xs opacity-80">
          <span className="font-mono">{`text-${scaleKey}`}</span>
        </div>
        <div
          ref={sampleRef}
          className="font-sans"
          style={{
            fontSize: `var(--text-${scaleKey})`,
            lineHeight: `var(--text-${scaleKey}--line-height)`,
            letterSpacing: `var(--text-${scaleKey}--letter-spacing)`,
            fontWeight: `var(--text-${scaleKey}--font-weight)` as React.CSSProperties['fontWeight'],
          }}
        >
          How vexingly quick daft zebras jump
        </div>
      </div>

      <div className="text-sm opacity-80 font-mono">{meta}</div>
    </section>
  )
}

export function ScaleRows() {
  return (
    <div className="flex flex-col gap-6">
      {SCALE_KEYS.map((key) => (
        <ScaleRow key={key} scaleKey={key} />
      ))}
    </div>
  )
}
