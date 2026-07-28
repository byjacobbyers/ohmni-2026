---
name: section-previews
description: >-
  Capture Sanity page-builder insert-menu thumbnails from /design/sections using
  Playwright, and wire Studio grid + list insert views with previewImageUrl.
  Use when setting up section-previews, running pnpm sections:previews, adding a
  new page-builder block snapshot, porting Ohmni’s capture-section-previews
  script to another repo (e.g. Sami), or when the user mentions section gallery
  grid thumbnails, insert menu previews, or section snapshot images.
---

# Section insert previews

Studio’s page-builder **insert menu** can show a **grid** of PNG thumbnails plus a **list** view. Thumbnails come from Playwright screenshots of `/design/sections` playgrounds—not from Sanity assets.

**They do not auto-generate** when you add a section. After a new playground (or a visual redesign), update the capture map and re-run `pnpm sections:previews`, then commit the PNGs.

## Pattern (Ohmni → other repos)

| Piece | Role |
|-------|------|
| `app/(site)/design/sections` | Live playgrounds; each `SectionChrome` has a stable `id` |
| `scripts/capture-section-previews.mjs` | Maps `#anchorId` → `{schemaType}.png` |
| `public/section-previews/*.png` | Committed thumbnails served by Next |
| `page-builder-schema.ts` `insertMenu.views` | `grid` + `previewImageUrl` + `list` |
| `pnpm sections:previews` | Runs the script (dev server required) |
| `playwright` (devDependency) | Chromium for capture |

Reference: Ohmni `scripts/capture-section-previews.mjs`, `sanity/schemas/components/page-builder-schema.ts`, `.claude/rules/new-section-checklist.md`.

## Wire insert menu

```ts
options: {
  insertMenu: {
    filter: true,
    groups: [{ name: 'core', title: 'Core', of: [...CORE_TYPES] }],
    views: [
      {
        name: 'grid',
        previewImageUrl: (schemaTypeName) =>
          `/section-previews/${schemaTypeName}.png`,
      },
      { name: 'list' },
    ],
  },
},
```

Missing PNGs → Studio falls back to the schema icon.

## Capture script checklist

1. Add `playwright` as a **devDependency** (pin near Ohmni’s version if possible).
2. Once: `pnpm exec playwright install chromium`.
3. Copy/adapt `scripts/capture-section-previews.mjs`:
   - `SECTIONS = [['anchor-id', 'schemaType'], …]` must match `SectionChrome id=` and `_type`.
   - Hide site chrome, cookie bars, sticky design controls, and playground chrome CSS.
   - Force opacity/transform so AppearAnimation isn’t invisible.
4. Script: `"sections:previews": "node scripts/capture-section-previews.mjs"`.
5. Document in README + new-section checklist.

## Run

```bash
# Terminal A
pnpm dev

# Terminal B
pnpm sections:previews
# optional: SECTION_PREVIEW_ORIGIN=http://localhost:3000
```

Commit new/changed files under `public/section-previews/`.

## When adding a section

1. Playground with `SectionChrome id="…"` + `type="…Block"`.
2. Append `[id, type]` to the capture script map.
3. Dev server → `pnpm sections:previews`.
4. Commit the PNG.

Do **not** expect CI or schema deploy to regenerate snapshots unless you explicitly add that later.

## Porting to a sibling repo (e.g. Sami)

- Align `SECTIONS` with that repo’s design anchors (Hero=`coverBlock`, Feature=`heroBlock`, Spacing=`dividerBlock`, etc.).
- Keep target surfaces/backdrop in the screenshot—do not force Ohmni chrome.
- Hide repo-specific sticky controls (Sami’s page-background strip uses `.sticky.top-13`).
- Only capture insertable types — no PNGs for deleted legacy `_type`s.

## Related

- Full Ohmni→target parity: skill `ohmni-parity` (phase 2–3 / design + Studio chrome).
- Details: [reference.md](reference.md).
