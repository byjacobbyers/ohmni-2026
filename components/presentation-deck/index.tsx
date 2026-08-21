import Link from 'next/link'
import Sections from '@/components/sections'
import { cn } from '@/lib/utils'
import KeyboardNav from './keyboard-nav'
import { screenHref, screenId, type ScreenBlock } from '@/lib/presentation-screens'

export type PresentationDeckProps = {
  slug: string
  /** Brand lockup for the corner mark, resolved the same way the header does. */
  brandName?: string
  brandTagline?: string
  blocks: Array<ScreenBlock & { _type?: string } & Record<string, unknown>>
  index: number
}

const MENU_ANCHOR = 'menu'

/**
 * One screen, full height, with the section's own padding intact so a deck
 * screen and the same block on a page look identical.
 */
export default function PresentationDeck({
  slug,
  brandName = 'Ohmni',
  brandTagline,
  blocks,
  index,
}: PresentationDeckProps) {
  const block = blocks[index]
  if (!block) return null

  const prev = index > 0 ? screenHref(slug, blocks, index - 1) : null
  const next = index < blocks.length - 1 ? screenHref(slug, blocks, index + 1) : null

  // Escape returns to the branch menu when one exists, otherwise to screen one.
  const menuIndex = blocks.findIndex((b) => b.anchor === MENU_ANCHOR)
  const menu = screenHref(slug, blocks, menuIndex === -1 ? 0 : menuIndex)

  return (
    <main
      id={screenId(block, index)}
      // The section fills the screen rather than sitting centred inside it, so
      // its background reaches the edges the way a slide would. Sections are
      // already `flex justify-center`; `items-center` centres them vertically.
      // Page rhythm (py-16 md:py-24) costs 269px of vertical space, which a
      // stacked page can afford and a single screen cannot. Tightened here so
      // the section components stay untouched.
      className={cn(
        'relative flex w-full flex-col overflow-y-auto',
        // Fill the screen so the section background reaches the edges, and cut
        // the page rhythm (py-16 md:py-24) that costs 269px a slide cannot spare.
        '[&>section]:min-h-screen [&>section]:items-center [&>section]:py-10 [&>section]:pb-20',
        'md:[&>section]:py-12 md:[&>section]:pb-20',
        '[&_.content]:max-w-4xl [&_.text-center_.content]:mx-auto',
        // ── Phone ────────────────────────────────────────────────────────────
        // A deck screen is one idea. Stacking card grids turns one idea into
        // three viewports of scrolling, so below md the cards stay in a row and
        // the row scrolls sideways. Deck only: on a page, stacking is correct.
        'max-md:[&_.grid]:grid-flow-col max-md:[&_.grid]:auto-cols-[17rem]',
        'max-md:[&_.grid]:overflow-x-auto max-md:[&_.grid]:pb-2',
        'max-md:[&_.grid]:[grid-template-columns:none]',
        // Diagrams are supporting evidence on a phone, not the subject.
        'max-md:[&_img]:max-h-[30vh] max-md:[&_img]:w-auto max-md:[&_img]:object-contain',
        // Display type set for a 1440px stage is oversized on a 375px one.
        'max-md:[&_h2]:text-2xl max-md:[&_h3]:text-lg max-md:[&_.content_p]:text-sm',
        'max-md:[&>section]:pt-16 max-md:[&>section]:pb-16'
      )}
    >
      {/* Orientation mark. A deck gets sent on and viewed without a presenter,
          so it should say whose it is on every screen. */}
      <div className="pointer-events-none fixed top-0 left-0 z-50 flex items-center gap-2 px-5 py-4">
        <img src="/ohmni.svg" alt="" aria-hidden className="h-5 w-5 md:h-6 md:w-6" />
        <span className="flex items-end gap-1.5 leading-none">
          <span className="text-sm leading-none font-bold md:text-lg">
            {brandName.toUpperCase()}
          </span>
          {/* The tagline is the first thing to go when the bar gets tight. */}
          {brandTagline ? (
            <span className="hidden pb-[1px] text-[0.6rem] leading-none uppercase sm:inline">
              {brandTagline}
            </span>
          ) : null}
        </span>
      </div>

      <Sections body={[block]} />

      <nav
        aria-label="Presentation"
        className="pointer-events-none fixed right-0 bottom-0 z-50 flex items-center gap-3 px-5 py-4"
      >
        <span className="bg-card/80 px-2 py-1 font-mono text-xs text-muted-foreground backdrop-blur">
          {index + 1} / {blocks.length}
        </span>
        <span className="pointer-events-auto flex items-center gap-2">
          {prev ? (
            <Link
              href={prev}
              aria-label="Previous screen"
              className="border border-border bg-card/80 px-3 py-1 text-sm no-underline backdrop-blur transition-colors hover:border-primary"
            >
              &larr;
            </Link>
          ) : null}
          {next ? (
            <Link
              href={next}
              aria-label="Next screen"
              className="border border-border bg-card/80 px-3 py-1 text-sm no-underline backdrop-blur transition-colors hover:border-primary"
            >
              &rarr;
            </Link>
          ) : null}
        </span>
      </nav>

      <KeyboardNav prev={prev} next={next} menu={menu} />
    </main>
  )
}
