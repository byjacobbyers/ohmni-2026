/**
 * The one icon vocabulary. Shared by every schema that offers an icon picker so
 * editors see the same names everywhere and the frontend needs a single map.
 *
 * Keep in sync with ICONS in `components/lucide-icon.tsx`. Adding an entry here
 * without adding it there means the icon silently does not render.
 */
export const iconOptions = [
  { title: 'Clock', value: 'LuClock' },
  { title: 'Code', value: 'LuCode' },
  { title: 'Layers', value: 'LuLayers' },
  { title: 'Missed mail', value: 'LuMailX' },
  { title: 'Chart', value: 'LuChartColumn' },
  { title: 'Search miss', value: 'LuSearchX' },
  { title: 'Sparkles (AI)', value: 'LuSparkles' },
  { title: 'Tag (pricing)', value: 'LuTag' },
] as const

export type IconValue = (typeof iconOptions)[number]['value']
