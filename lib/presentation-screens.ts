/**
 * Screen identity for a presentation deck.
 *
 * `anchor` when the editor set one, otherwise the block `_key`. Keeping the
 * fallback means a screen is never unreachable just because someone skipped an
 * optional field; the anchor only buys a readable URL.
 */
export type ScreenBlock = { _key?: string; anchor?: string | null }

export function screenId(block: ScreenBlock, index: number): string {
  return block.anchor || block._key || `screen-${index + 1}`
}

/** Index of the requested screen, or 0 when the segment is absent or unknown. */
export function screenIndex(blocks: ScreenBlock[], requested?: string): number {
  if (!requested) return 0
  const found = blocks.findIndex((b, i) => screenId(b, i) === requested)
  return found === -1 ? 0 : found
}

export function screenHref(slug: string, blocks: ScreenBlock[], index: number): string | null {
  const block = blocks[index]
  if (!block) return null
  return `/present/${slug}/${screenId(block, index)}`
}
