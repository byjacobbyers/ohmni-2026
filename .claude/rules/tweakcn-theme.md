# tweakcn theme provenance

The Ohmni shadcn/ui theme was originally authored in [tweakcn](https://tweakcn.com/). **Canonical store is `tokens/`** (Style Dictionary), not a pasted CSS dump from the exporter.

## Do / don’t

- **Do** edit `tokens/color.json`, `font.json`, `radius.json`, `shadow.json`, and related JSON → `pnpm tokens:build`.
- **Do** review at `/design` after token changes.
- **Don’t** paste tweakcn output into `globals.css` or `app/(site)/generated/tokens.css`.
- **Don’t** maintain a second palette for “shadcn vs marketing.”

## Re-theme workflow (tweakcn → repo)

1. Export / copy CSS variables from [tweakcn.com](https://tweakcn.com/).
2. Map vars into DTCG JSON under `tokens/` (`color`, `font`, `radius`, `shadow`; space/tracking if present).
3. Run `pnpm tokens:build`.
4. If light colors changed, update [`lib/brand-palette.ts`](lib/brand-palette.ts) hex values for email/PDF.
5. Review `/design` (and `/design/components`). Regenerate section snapshots (`pnpm sections:previews`) only if default section look shifts.

## Preserve Ohmni choices unless intentionally changing brand

- Radius `0` (sharp corners) in `tokens/radius.json`
- Inter sans (`tokens/font.json` + `app/(site)/fonts.ts`)
- Existing primary blue (`#3265fd` light) unless a deliberate rebrand
