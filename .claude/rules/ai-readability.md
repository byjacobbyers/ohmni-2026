# AI readability: llms.txt and Markdown twins

Every page and post has a Markdown twin: append `.md` to its URL (`/pricing.md`,
`/es/pricing.md`, `/posts/<slug>.md`; the home page is `/index.md`). `/llms.txt`
is the index, `/llms-full.txt` is every twin in one file. All three are built
from the same Sanity documents the pages render. **There are no extra fields**
for this: titles, SEO descriptions, navigation one-liners, excerpts and the
sections' Portable Text are the source, and the index groups itself by the
header navigation.

- Builders are pure and tested: `lib/portable-text-to-markdown.ts`,
  `lib/llms.ts`. Fetching lives in `lib/llms-server.ts`; routes are
  `app/llms.txt`, `app/llms-full.txt` and `app/md/[lang]/[type]/[slug]`,
  reached through the `.md` rewrites in `next.config.ts`.
- **The handlers are dynamic on purpose.** A cached route never runs, and the
  point of the `llms_fetch` PostHog event is counting real crawler reads by
  user agent. One CDN query per request is the price; do not add ISR here.
- A new block with readable copy needs a `case` in `sectionToMarkdown`, or its
  `_type` in `MARKDOWN_SKIPPED_BLOCKS` when it has none (media, spacing,
  lists of other documents). `lib/section-registry.test.ts` fails until one
  of those is true.
- Pages with `seo.noIndex` are excluded from the index and the full file, so
  A/B variants and anything unlisted stay out. Decks are not pages and never
  appear.
- Say it honestly where it matters: llms.txt is a proposal, not a standard,
  and Google does not use it. The `.md` twins are the part with unambiguous
  value; they fall out of structured content for free, which is the argument.
