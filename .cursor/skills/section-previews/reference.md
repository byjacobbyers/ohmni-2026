# Section previews — reference

## Auto-generate?

**No.** Snapshots are produced only when someone runs `pnpm sections:previews` against a running `/design/sections` page. Adding a schema or playground does not create a PNG by itself.

Optional future work (not standard): a CI job that starts the app, runs Playwright, and uploads artifacts—still not “on schema change” unless you wire it.

## Ohmni SECTIONS map (example)

See `scripts/capture-section-previews.mjs` in Ohmni. Anchors are design hash ids (`cover`, `hero`, `divider`, …), not Studio titles.

## Sami SECTIONS map (parity)

| Anchor (`SectionChrome id`) | Schema `_type` | Studio title |
|-----------------------------|----------------|--------------|
| `hero` | `coverBlock` | Hero |
| `feature` | `heroBlock` | Feature |
| `banner` | `bannerBlock` | Banner |
| `cta` | `ctaBlock` | CTA |
| `text` | `textBlock` | Text |
| `image` | `imageBlock` | Image |
| `video` | `videoBlock` | Video |
| `gallery` | `galleryBlock` | Gallery |
| `faq` | `faqBlock` | FAQ |
| `column` | `columnBlock` | Column |
| `logo-bar` | `logoBarBlock` | Logo bar |
| `quote` | `quoteBlock` | Quote |
| `stats` | `statsBlock` | Stats |
| `form` | `formBlock` | Form |
| `embed` | `embedBlock` | Embed |
| `spacing` | `dividerBlock` | Spacing |

## Capture quirks

- Prefer `waitUntil: 'load'` over `networkidle` (Next.js HMR never goes idle).
- **AppearAnimation / motion** — force `opacity: 1` and `transform: none` via injected CSS + per-node evaluate.
- **Empty box** — spacer-like gap sections or unloaded media may skip; ensure fixtures render visible height (e.g. `showImagePlaceholder`).
- **Max clip height** — script caps at ~480px so tall sections don’t dominate the grid.
- **Cookie / header / sticky strips** — hide before screenshot or thumbnails include chrome.
- **Grainient / lava backdrop** — fine to leave; matches Sami essence in Studio previews.

## Browse section gallery

Document action opening `/design/sections` is separate from insert thumbnails. Both should exist: live playground for editors, PNGs for the insert grid.
