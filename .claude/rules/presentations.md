# Presentations

Decks live at `/present/{slug}` and are presented one screen at a time. A deck
is a `presentation` document, not code.

## Adding or editing a deck

Create a `presentation` in Studio. **Do not add a route, a component, or a
block type for a new deck.** Screens reuse the page-builder `sections` type, so
every block, the insert menu and the section thumbnails are the ones the site
already uses.

- **One idea per screen.** Screens render at `min-h-screen`. Anything taller
  scrolls, which breaks the pacing the format exists for. If a screen needs a
  scrollbar, split it.
- **Set `anchor` on each section.** It becomes the URL (`/present/deck/menu`).
  Without it the screen falls back to the block `_key`, which works but reads as
  gibberish when you deep-link mid-call.
- **`anchor: "menu"`** marks the branch screen. `Esc` returns there.
- **Branch links are `linkType: 'path'`**, pointing at
  `present/{slug}/{anchor}`. Real links, so Next owns prefetch, history and
  cmd-click. Never intercept anchor clicks to change screens.
- Decks are `noindex` and excluded in `app/robots.ts`. Keep it that way; they
  are sales material, not pages.

## What the deck shell does and does not do

`components/presentation-deck` handles arrow keys, the screen counter and the
prev/next chrome. Everything visual comes from the section components.

Screen padding is tightened to `py-10` in the deck wrapper, because page rhythm
(`py-16 md:py-24`) costs 269px that a stacked page can afford and a single
screen cannot. **Override it there, never in a section component.**

## Verifying

Motion animations freeze mid-fade when the preview tab is backgrounded, so a
screenshot can come back black on a screen that renders fine. Front the tab
before capturing, or check the DOM instead of the picture.
