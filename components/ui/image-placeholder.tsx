import { cn } from '@/lib/utils'

const ASPECT = {
  video: 'aspect-video',
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  wide: 'aspect-[21/9]',
  auto: '',
} as const

export type ImagePlaceholderProps = {
  className?: string
  /** Primary label in the center badge */
  label?: string
  /** Small caption under the badge (e.g. Hero media) */
  caption?: string
  aspect?: keyof typeof ASPECT
  /** Show crop-mark corners + crosshair */
  marks?: boolean
}

/**
 * Wireframe media slot for design review — not a Sanity image fallback.
 */
export function ImagePlaceholder({
  className,
  label = 'IMAGE',
  caption,
  aspect = 'video',
  marks = true,
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={caption ? `${label}: ${caption}` : label}
      className={cn(
        'image-placeholder relative isolate w-full overflow-hidden rounded-md',
        'border border-dashed border-primary/35 bg-muted/30',
        ASPECT[aspect],
        className
      )}
    >
      {/* Hatch + soft grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              -32deg,
              transparent,
              transparent 9px,
              color-mix(in srgb, var(--primary) 14%, transparent) 9px,
              color-mix(in srgb, var(--primary) 14%, transparent) 10px
            ),
            linear-gradient(to right, color-mix(in srgb, var(--border) 70%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in srgb, var(--border) 70%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: 'auto, 24px 24px, 24px 24px',
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 35%, color-mix(in srgb, var(--background) 55%, transparent) 100%)',
        }}
      />

      {marks ? (
        <>
          {/* Corner crop marks */}
          <span aria-hidden className="absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2 border-primary/60" />
          <span aria-hidden className="absolute right-2 top-2 h-4 w-4 border-r-2 border-t-2 border-primary/60" />
          <span aria-hidden className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-primary/60" />
          <span aria-hidden className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-primary/60" />

          {/* Crosshair */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-8 w-px -translate-x-1/2 -translate-y-1/2 bg-primary/25"
          />
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 -translate-y-1/2 bg-primary/25"
          />
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/50"
          />
        </>
      ) : null}

      {/* Center badge */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 p-4">
        <div className="flex items-center gap-2 border border-primary/40 bg-background/85 px-3 py-1.5 shadow-sm backdrop-blur-sm">
          <span
            aria-hidden
            className="size-2 shrink-0 bg-primary motion-safe:animate-pulse"
          />
          <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-foreground uppercase">
            {label}
          </span>
        </div>
        {caption ? (
          <span className="font-mono text-[10px] tracking-wide text-muted-foreground">
            {caption}
          </span>
        ) : null}
      </div>
    </div>
  )
}
