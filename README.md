# ohmni.tech

The Ohmni business site: Next.js 16 + Sanity, deployed on Vercel.

## Stack

- **Next.js (App Router)** with Tailwind v4 and shadcn/ui primitives
- **Sanity Studio** embedded at `/studio` — page builder, posts, events, redirects
- **PostHog** analytics behind a first-party proxy (`/relay-oh`), consent-gated
- **GTM/GA4 lane**: set `NEXT_PUBLIC_GTM_ID` to load GTM via `@next/third-parties`;
  Consent Mode is bootstrapped in `app/(site)/layout.tsx` before GTM loads.
  Configure GA4 and other tags inside GTM, not in app code. Optional:
  `NEXT_PUBLIC_ENABLE_GEOLOCATION=true` pushes a `geolocation_detected`
  data-layer event (consent-gated) via `/api/geolocation`.
- **Lead pipeline** (Inngest): form → Attio CRM + Customer.io journey + PostHog
  event + Slack ping + Resend notification, each step retried independently
- **CMS-driven redirects** enforced in middleware
- **SEO/AEO**: server-rendered JSON-LD on every content type, canonicals,
  generated OG images, sitemap

## Development

```bash
pnpm install
pnpm dev                      # site + studio on :3000
npx inngest-cli@latest dev    # local pipeline runner (optional)
```

Copy `.env.example` to `.env.local` and fill in keys. Every integration
no-ops gracefully when its key is unset. `INNGEST_DEV=1` belongs in
`.env.local` only, never in production env.

Verification floor: `pnpm build`, `pnpm lint`, and `pnpm test` must pass.

## Caching / freshness

- **Production:** Sanity publish webhook → `/api/revalidate/path` (primary). ISR `revalidate = 60` is the safety net.
- **Draft / Presentation:** `SanityLive` + Visual Editing mount only when draft mode is on.
- Prefer a **Viewer** token in `SANITY_VIEWER_TOKEN` for draft Live (browser); keep write tokens server-only.

## Sanity TypeGen

Hand-written `types/` still exist. To generate query result types:

```bash
pnpm typegen
```

Then migrate queries from `groq\`...\`` to `defineQuery(...)` and replace `SanityDocument` casts incrementally.

## Layout

- `app/` routes; `components/` blocks (registered in `components/sections`)
- Header/footer fetch their own Sanity data in `components/header/server.tsx` and `components/footer/server.tsx` (same pattern as posts/events list servers)
- `sanity/` schemas, queries, studio structure
- `lib/` brand config, SEO helpers, lead pipeline, Inngest functions
- `emails/` transactional/campaign email templates
- `scripts/` one-off utilities (e.g. redirect CSV import)
- `plans/` private planning docs (gitignored)

Content blocks follow a 4-file pattern: schema (`sanity/schemas`),
query projection (`sanity/queries/components/sections-query.ts`),
type (`types/components`), component (`components/<name>`), plus
registration in the page builder and `components/sections` block map.
