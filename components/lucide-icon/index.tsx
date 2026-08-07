import {
  ChartColumn,
  Clock,
  Code2,
  Layers,
  MailX,
  SearchX,
  Sparkles,
  Tag,
  type LucideIcon as LucideIconType,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * The one icon map. Keep in sync with `iconOptions` in
 * sanity/schemas/lib/icon-options.ts: a name offered there but missing here
 * renders nothing at all, silently.
 */
export const ICONS: Record<string, LucideIconType> = {
  LuClock: Clock,
  LuCode: Code2,
  LuLayers: Layers,
  LuMailX: MailX,
  LuChartColumn: ChartColumn,
  LuSearchX: SearchX,
  LuSparkles: Sparkles,
  LuTag: Tag,
}

export type LucideIconProps = {
  /** Name from the shared vocabulary, e.g. 'LuLayers' */
  name?: string
  className?: string
  strokeWidth?: number
}

/** Renders nothing when the name is missing or unknown, so callers need no guard. */
export default function LucideIcon({
  name,
  className,
  strokeWidth = 1.75,
}: LucideIconProps) {
  const Icon = name ? ICONS[name] : null
  if (!Icon) return null
  return <Icon className={cn('h-5 w-5', className)} strokeWidth={strokeWidth} aria-hidden />
}
