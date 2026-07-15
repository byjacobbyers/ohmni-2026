# AEO / AI-Search Visibility Audit

Ohmni template, audited July 14, 2026 against current evidence (BUILD-PLAN Task 6). Each item lists status and, where relevant, the evidence for implementing or skipping. Speculative items are marked; re-audit when the evidence shifts.

## Structured-data coverage (after this pass)

| Surface | Schema emitted | Source | Status |
|---|---|---|---|
| Every page | Organization (name, legalName, logo, address, sameAs, contact) | Site Settings in CMS | Complete, entity-clear |
| Every page | WebSite | Site Settings | Complete |
| Every page | Canonical URL + per-page override | SEO settings (Task 5) | Complete |
| Pages (`/`, `/[slug]`) | WebPage + dateModified | Document | Complete |
| Events | Event (dates, location, image) | Document | Complete |
| Posts | Article (headline, author, dates, image) + BreadcrumbList | Document (Task 3) | Complete |
| Posts | `og:type article` + published/modified time | Document | Added in this pass |
| Any page with FAQ blocks | FAQPage (portable text flattened to plain answers) | Page builder | Complete |
| Share images | Per-document generated 1200x630 OG images | `/api/og` | Complete |

## Critical finding fixed during this audit

**All JSON-LD was injected client-side (`next/script`, afterInteractive) and therefore absent from the server-rendered HTML.** Google executes JavaScript; most AI crawlers (GPTBot, ClaudeBot, PerplexityBot) do not, so every schema on the site was invisible to exactly the engines this work targets. All five emission points now render plain `<script type="application/ld+json">` tags server-side. Verified: Organization, WebSite, and WebPage schemas present in the raw HTML response with JavaScript disabled.

## Semantic chunking

Portable-text output renders through @portabletext/react defaults: real `h2`-`h4`, `ul`/`ol`, `blockquote`, plus `figure`/`figcaption` for images. Content pages are parseable as clean heading-scoped chunks, which is what retrieval pipelines actually consume. No changes needed.

## Crawler access

`robots.txt` allows all user agents (including GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended) and disallows only `/api/*` and `/studio/*`. This is a deliberate decision, now documented in `app/robots.ts`: AI-search visibility is the pitch, so AI crawlers are welcome. Clients who license content restrictively can add per-bot disallow rules per engagement.

## Evidence review: items evaluated and SKIPPED

These were listed for evaluation in BUILD-PLAN with an explicit re-verify-at-build-time clause. The July 2026 evidence moved against them.

1. **llms.txt / llms-full.txt - skipped (evidence negative).** Google's June 2026 Search Central documentation states Google Search does not use llms.txt for anything, including AI Overviews. Ahrefs measured that 97% of 137k domains publishing one saw zero requests for it from AI crawlers in May 2026; SE Ranking's ML analysis found its presence added no signal to citation-frequency prediction. The one documented real use case, token-efficient docs for programmatic agent consumers, does not apply to a marketing site. Revisit only if a major engine documents consumption.
2. **IndexNow pings - skipped (marginal, not trivial).** Only the Bing/Copilot surface consumes it; requires key hosting plus publish-webhook wiring. Below the value bar for a marketing site today. ASSUMPTION: revisit if Bing-surface citations become a client KPI.
3. **AI-crawler-specific robots directives - no action needed.** The correct stance for visibility is allow-all, which is already the default here. Nothing to add.

## Content-level notes (editor discipline, not code)

- Meta descriptions: the SEO panel supports them everywhere; AI answer engines quote them. Keep them written, not defaulted.
- FAQ blocks are the highest-leverage AEO surface this template has: real questions with self-contained answers get lifted into AI answers. Use them on service pages, not just a FAQ page.
- `quiz` and `resources` render on-demand but are excluded from sitemap/static params and self-canonicalize; if either should disappear from engines entirely, tick its per-page `noIndex` in the SEO panel.

## Before / after summary (the slide)

Before: Organization, WebSite, WebPage, Event, FAQ markup; no posts; no canonicals; no Article markup; llms.txt untested assumption.
After: full structured-data coverage across every content type including Article + BreadcrumbList, canonical URLs everywhere with CMS override, `og:type article` with publish metadata, documented AI-crawler stance, and a written evidence trail for what was deliberately not built and why.
