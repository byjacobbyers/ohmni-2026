# New section checklist

When you **do** add or rename a page-builder block `_type`, finish the catalog pipeline—not just the React component.

1. **Schema** — `*-block-schema.ts` with icon + description; shared chrome via `sanity/schemas/lib/section-chrome.ts` (`active`, `anchor`, background when relevant). Register in `sanity/schemas/index.ts`.
2. **Insert menu** — Add `_type` to `CORE_TYPES` or `ADDON_TYPES` in `sanity/schemas/components/page-builder-schema.ts`.
3. **Frontend** — Follow section/container/`AppearAnimation` patterns from a peer block; register in `components/sections/index.tsx` + GROQ in `sections-query.ts` if needed.
4. **Stega guard** — If the block adds an enum-like field that drives a branch (`variant`, `layout`, `size`, `alignment`, …), add its name to `STEGA_LOGIC_FIELDS` in `sanity/lib/client.ts`, or clean it with `cleanStega` at the comparison. Visual editing encodes invisible characters into every string, so an unguarded `variant === 'proof'` works in production and silently fails **only in Presentation preview**.
5. **Design playground** — Playground in `app/(site)/design/sections/playgrounds.tsx` (`SectionChrome` id + type, controls, fixtures); wire `page.tsx` + `NAV`.
6. **Snapshot map** — `[anchorId, schemaType]` in `scripts/capture-section-previews.mjs`.
7. **Capture** — Dev server up → `pnpm sections:previews` → commit `public/section-previews/{_type}.png`.

Studio insert thumbnails resolve to `/section-previews/{_type}.png`. Missing files fall back to the schema icon—do not ship a new block without a snapshot once the playground exists.
