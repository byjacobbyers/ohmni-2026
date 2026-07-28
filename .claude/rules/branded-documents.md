# Branded documents (email, PDF, invoice)

When building **emails, PDFs, invoices, or other off-site documents**, match Ohmni’s visual identity — but **do not** copy the website’s Tailwind/section/Motion stack. Those surfaces cannot use `globals.css` the same way.

## Source of truth

| Concern | Where |
|--------|--------|
| Hex colors + document font stack | [`lib/brand-palette.ts`](lib/brand-palette.ts) (keep synced with `tokens/color.json` light + `tokens/font.json`) |
| Design tokens (site UI) | `tokens/*.json` → `pnpm tokens:build` → `/design` |
| Name, tagline, email from-address | [`lib/brand.ts`](lib/brand.ts) / `resolveBrand` |
| Logo | `public/ohmni.svg` (or CMS logo when available) |
| Live reference | `/design` (colors, type), production site chrome |

Primary accent today: `#3265fd` (`brandPalette.primary`).

## Per medium

### Email (Resend / transactional)

- Prefer `@react-email/components` for **new** templates under `emails/` when adding campaigns; existing internal notice lives in [`components/email-template`](components/email-template/index.tsx).
- **Inline styles** (or React Email primitives) only — no Tailwind classNames, no Motion, no texture/canvas heroes.
- Use `brandPalette` for colors/fonts; `brand` for product name / subjects.
- CTAs: solid `primary` background + `primaryForeground` text; links use `primary`.
- Layout: simple single column, ≤600px, clear hierarchy; table layouts OK for client compatibility.
- Wire sends through existing Resend helpers (`lib/lead.ts` pattern); no-op when keys missing.

### PDF / invoice

- Use a PDF-oriented stack (e.g. `@react-pdf/renderer` or HTML→PDF with print CSS) — not page-builder sections.
- Embed or substitute fonts consistent with Inter / `brandPalette.fontSans`.
- Token hex for primary, foreground, muted, border; white/light backgrounds; generous whitespace.
- Header: logo + Ohmni name. Invoices: bill-to, line items, totals — scannable, not marketing-page chrome.
- Prefer a `documents/` or `pdf/` folder for reusable templates when you add them.

### One-off HTML / print docs

- Same palette; `@media print` friendly; avoid dark full-bleed heroes and site nav chrome.

## Do / don’t

- **Do** read `brandPalette` + `brand` before inventing colors or names.
- **Do** keep document templates reusable in-repo (not one-off chat dumps).
- **Don’t** reuse section shells (`px-5 py-16`, `AppearAnimation`, texture backdrop) in email/PDF.
- **Don’t** invent a second brand system for “documents.”
- **Don’t** hand-edit `app/(site)/generated/tokens.css` — update `tokens/` (and mirror hex in `brand-palette.ts` when light palette changes).

## Checklist

1. Confirm palette from `lib/brand-palette.ts` / `/design`
2. Pick medium stack (email vs PDF vs print HTML)
3. Build with palette hex / React Email — not Tailwind utilities
4. Brand name + logo consistently
5. Keep layout simple and scannable (especially invoices)
