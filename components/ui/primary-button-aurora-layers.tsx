'use client'

import type { ReactNode } from 'react'

import AuroraBits from '@/components/aurora-bits'

const PRIMARY_AURORA_STOPS = ['#7cff67', '#B19EEF', '#5227FF'] as const

type PrimaryButtonAuroraLayersProps = {
  children: ReactNode
  /** When false, Aurora WebGL is not mounted (lazy first hover). */
  mountAurora?: boolean
}

export function PrimaryButtonAuroraLayers({
  children,
  mountAurora = true,
}: PrimaryButtonAuroraLayersProps) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-primary transition-opacity duration-300 ease-out group-hover:opacity-0 motion-reduce:opacity-100 motion-reduce:group-hover:opacity-100"
      />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:opacity-0 motion-reduce:group-hover:opacity-0">
        {mountAurora ? (
          <AuroraBits
            colorStops={[...PRIMARY_AURORA_STOPS]}
            blend={0.5}
            amplitude={1}
            speed={1}
          />
        ) : null}
      </div>
      <span className="relative z-10 inline-flex min-w-0 items-center justify-center gap-2">
        {children}
      </span>
    </>
  )
}
