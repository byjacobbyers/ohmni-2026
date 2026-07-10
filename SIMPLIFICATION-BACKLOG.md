# Simplification Backlog

Deferred findings from the Stage 1 simplification pass (July 10, 2026). Each item notes what supersedes it. Do not do these ahead of the superseding task; the code will be rewritten anyway.

## Demo-path deferrals (superseded by BUILD-PLAN.md phase 1)

1. **Two OG routes ~90% duplicated.** `app/api/og/route.tsx` and `app/api/og/preview/route.tsx` repeat `DOC_TYPES`, the slug regex, and the fetch/404 block verbatim; preview only adds a dev gate plus heading/background overrides. Collapse to one shared resolver (~-40 lines). Superseded by: Task 6 (AEO hardening) / Task 7 (brand config), whichever touches the OG pipeline first.
2. **`lib/seo.ts` collapse.** `buildGeneratedOgImageUrl` and `buildUrl` have no external callers; `resolveOgImageUrl` duplicates the share-graphic guard in `lib/og-share-graphic.ts`; `generateMetadata` takes 5 positional args plus an options object for 4 near-identical call sites. Superseded by: Tasks 3, 5, and 7 all extend this file.
3. **Hardcoded `' :: Ohmni'` title suffix** in `app/(site)/[slug]/page.tsx:46` and `app/(site)/events/[slug]/page.tsx:45`, plus `'Ohmni'` fallback literals in `lib/seo.ts` (5 sites), `lib/og-image-response.tsx`, both layouts, `sanity.config.ts`, header, footer. Superseded by: Task 7 brand config extraction / stage 3 neutral-baseline work.
4. **GROQ `seo`/`shareGraphic` projection duplicated with drift.** Repeated in page, event, and og-route queries; only og-route has the `coalesce(autoShareImage...)` logic. Unify into one shared fragment. Superseded by: Task 3 (blog reuses the query pattern) and Task 6.
5. **`stripTrailingSlash` (lib/site-url.ts) vs `normalizeBaseUrl` (lib/seo.ts, app/sitemap.ts).** Same one-line regex under different names in three files. Superseded by: Task 7 (both files are named brand-config extraction targets).
6. **`app/api/send` + `components/email-template`.** No standalone findings; Task 2 replaces the whole pipeline with the Inngest/Attio flow.

## Out of scope for the pass (correctness, not simplification)

Pre-existing lint errors, left untouched (11 errors baseline after the July 2026 dependency update; eslint now ignores the .claude/ worktrees that used to double-report):

- `components/cover-block/index.tsx:166` conditional `useEffect` (rules-of-hooks)
- `components/gallery-block/index.tsx:17` conditional `useState` (rules-of-hooks)
- `components/Radar.tsx:130-131` and `components/soft-aurora/index.tsx:176-177` prefer-const
- `components/ui/input.tsx:5` empty interface
- `sanity/schemas/inputs/auto-share-image-input.tsx:24` synchronous setState in effect
- `components/FaultyTerminal.tsx:277`, `components/LetterGlitch.tsx:30,175` impure function call during render (new rule in eslint-config-next 16.2)

First candidate to fix when the backlogged test/CI gate (BUILD-PLAN backlog) lands.

## Held upgrades (July 2026 dependency pass)

- **eslint 9 → 10:** blocked; eslint-config-next has no v10 support yet. Revisit when vercel/next.js#91702 closes.
- **typescript 5.9 → 7 (tsgo):** blocked; the Go compiler's stable programmatic API (needed by typescript-eslint and friends) lands in TS 7.1. Revisit then.
- **Sanity TypeGen:** untyped `sanityFetch` results are `{}`/`unknown` in next-sanity 13; call sites carry casts for now. Adopting TypeGen would replace the casts with generated query types.

## Housekeeping noticed during the pass

- Stale git worktree at `.claude/worktrees/vibrant-buck` (detached HEAD, from an old agent session). ESLint scans it and double-reports every finding. Remove with `git worktree remove` once confirmed unneeded, or add `.claude/worktrees` to eslint ignores.
- SEO/OG modules still hardcode `https://www.ohmni.com` fallbacks in several places; covered by Task 7.
