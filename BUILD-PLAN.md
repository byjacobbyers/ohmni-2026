# BUILD-PLAN.md: Client Zero (ohmni.tech)

Dogfooding plan: ohmni.tech becomes the first site running the full stack from `MARTECH-STACK-FINAL.md`, so every sales call includes a live demo of the real system. Two months of runway. The sequencing test for every task: does a prospect see this in the next 30 days? Deal-closing work before time-saving work.

## Working style for all build sessions (inherit these rules)

- Work interview-style. Before starting each area, surface improvement opportunities noticed in the existing code and ask before implementing. Known example of the kind: the OG share-image generator falls back page title, then form title, but the meta title is often the better first input. Find more of these per area; do not silently "fix" them.
- One phase-1 task at a time, shipped and verified, before the next.
- Every task closes with: what a prospect would see, in one sentence. No sentence, question the phase.
- No em dashes in any output. Use commas, periods, or parentheses.
- Mark every estimate and judgment call ASSUMPTION where evidence is missing.

## Interview decisions (recorded 2026-07-10)

1. **Demo format.** Full vision: live walkthrough on sales calls plus a recorded Loom. Day-30 artifact: the live walkthrough. The Loom is phase 2 (record the walkthrough once it is smooth).
2. **License spend.** New paid: Otterly Lite $29/mo (AEO dashboard to show on calls) + Customer.io Essentials $100/mo (demo the tool actually sold; all needed APIs verified ungated on Essentials per the final report's Verification Log). Total new burn: **$129/mo**. Everything else starts free: Sanity free tier, existing Vercel, PostHog free (config-disciplined), Resend free, Inngest free, GSC, existing Attio workspace, Screaming Frog free version (500-URL crawl suffices for ohmni.tech; defer the $259/yr license to the first client migration). The owned DataForSEO pipeline is deferred until the first retainer signs, per the stated buy-cheap-now bias.
3. **Hours.** 12-15 hrs/week honest capacity alongside hourly client work and Prosp follow-ups. That is ~50-60 hours in the 30-day window against a ~52-63 hour phase-1 estimate, so phase 1 carries an explicit cut line (below).
4. **Postgres scope.** Gated-content demo (Neon + Auth.js) is phase 2, conditional: scheduled only if phase 1 ships on time, and it is the first thing cut if the demo path slips.
5. **Tier-ladder ASSUMPTIONS that build things.** Monthly report: branded doc template in phase 2 (~3 hrs); the generated Next.js report page moves to phase 3 alongside the DataForSEO pipeline it depends on. Improvement allowance: CHANGELOG.md in the repo, rendered at a private URL, phase 2 (~3-4 hrs). Non-building assumptions stay as calibration notes: one deliverable ≈ 2-4 operator hours, migration threshold ~25 pages.

---

## Phase 1: Demo path (days 1-30)

Budget: ~52-63 hrs estimated vs ~50-60 hrs available. Tasks 1-4 are the demo spine and must land for the day-30 walkthrough. Tasks 5-7 are phase 1 by importance but sit below the cut line: any of them can slip into week 5 without harming the demo. All hour estimates are ASSUMPTIONS (Claude Code leverage assumed; calibrate after the first two tasks and re-plan if actuals run 1.5x).

### Task 1: Analytics + tracking baseline (PostHog, two-lane)

- **What:** PostHog client SDK behind a first-party reverse proxy (Next.js rewrite), `posthog-node` server-side capture, a ~20-line bridge forwarding the template's existing dataLayer CTA events (trackingId, cta_location) into PostHog, and the config discipline from the final report: curated autocapture, replay sampled or form-triggered, client-side flags only, billing caps set. GA4/GTM lane already exists in the template; verify consent-mode wiring against the June 15, 2026 `ad_storage` change flagged in the report.
- **Why this phase, why first:** the closed-loop demo (visit, form, CRM, event) depends on it, and the phase-2 sample report needs ~30 days of real data accruing, so every day this is not live delays that artifact.
- **Hours:** 6-8 (ASSUMPTION).
- **Depends on:** nothing. Everything downstream depends on it.
- **Prospect sees:** live PostHog dashboard of ohmni.tech traffic that survives ad blockers, on screen during the call.

### Task 2: Form submissions persist to Attio (the speed-to-lead demo)

- **What:** replace the email-only `/api/send` path with an Inngest-orchestrated pipeline: validate, upsert person/company into the real Attio workspace via API, fire a PostHog server event, send the Resend notification as a step (not the system of record). Retries and failure alerting to your Slack. PDL enrichment as an optional step behind an env flag (defer the paid key until a client needs it, ASSUMPTION that demo works without enrichment).
- **Why this phase:** this is the core walkthrough moment and fixes the template's worst documented gap (leads dying in a notification inbox).
- **Hours:** 6-10 (ASSUMPTION).
- **Depends on:** Task 1 (PostHog server events).
- **Prospect sees:** a form submitted on the live site appears in Attio with a timeline event before the call moves to the next slide.

### Task 3: Blog content type with Article JSON-LD

- **What:** `post` document type (author, category, publish date), Article + BreadcrumbList JSON-LD via the existing centralized `lib/seo.ts` pattern, listing page, sitemap integration, reusing the existing 4-file pattern (schema, query, type, component) and portable-text components.
- **Why this phase:** the content engine every prospect asks about, and the AEO pitch requires owned long-form content to be citable.
- **Hours:** 8-12 (ASSUMPTION).
- **Depends on:** nothing structurally; after Task 2 by priority.
- **Prospect sees:** a real blog post composed in Studio during the call, published without a deploy, with rich-result markup visible in a validator.

### Task 4: CMS-driven redirects

- **What:** a redirect document type in Sanity (source, destination, permanent flag) enforced in middleware with a cached lookup, plus a bulk-import path for migration CSV maps.
- **Why this phase:** migration is the core pitch and redirects are how migrations do not destroy SEO; this is the "your rankings survive the move" proof.
- **Hours:** 4-6 (ASSUMPTION).
- **Depends on:** nothing.
- **Prospect sees:** a redirect created in the CMS taking effect on the live site within seconds, no deploy, no ticket.

**Day-30 walkthrough checkpoint:** Tasks 1-4 plus a 30-minute rehearsal of the demo script (compose page, publish, submit form, show Attio + PostHog, create redirect). Rehearsal hours: 2 (ASSUMPTION).

### Cut line. Tasks below can slip to week 5 without harming the day-30 demo.

### Task 5: Canonical URLs

- **What:** `alternates.canonical` in the `generateMetadata` cascade with a per-page override field in the SEO schema object.
- **Why this phase:** small, real technical-SEO gap named in the report; cheap credibility.
- **Hours:** 2-3 (ASSUMPTION).
- **Depends on:** nothing.
- **Prospect sees:** nothing directly; it appears in the AEO/SEO audit output of Task 6 as a passed check.

### Task 6: AEO/SEO hardening (audit, then implement the proven subset)

- **What:** audit the template against current AI-search-visibility practice and implement what passes evidence review. Proven per the research (implement): structured-data coverage across all types, entity-clear Organization data from CMS, FAQ markup (exists), Article markup (Task 3), clean semantic chunking of portable-text output, llms.txt generation from CMS content. Speculative (implement only if trivial, mark as speculative in the audit doc): llms-full.txt, IndexNow pings, AI-crawler-specific robots directives (evidence of effect is weak as of July 2026, ASSUMPTION to re-verify at build time).
- **Why this phase:** AI search visibility is literally the pitch; the audit artifact doubles as the sales-call slide and the Otterly Lite dashboard gives it numbers.
- **Hours:** 8-10 total: ~3 audit, ~5-7 implementation (ASSUMPTION).
- **Depends on:** Tasks 3 and 5 (Article markup and canonicals are audit line items).
- **Prospect sees:** a before/after structured-data coverage report on ohmni.tech and an Otterly dashboard tracking its AI-answer citations.

### Task 7: Brand config extraction (the future intake questionnaire)

- **What:** one typed config module holding every hardcoded Ohmni string, color, font, and fallback URL (the report names `lib/seo.ts`, `sitemap.ts`, `robots.ts`, `api/send`, plus the duplicated excluded-slugs lists). Each field documented with the client-intake question that would populate it, because this schema becomes the phase-3 questionnaire output.
- **Why this phase:** it is the onboard-a-client-fast claim made real, and every week it waits, new hardcoded strings accrete.
- **Hours:** 6-8 (ASSUMPTION).
- **Depends on:** nothing; last because it is invisible on a demo call.
- **Prospect sees:** nothing directly; it is what makes "your site can be live on this system in week one" a true sentence.

---

## Phase 2: Showcase depth (days 30-60)

Budget: ~24-34 hrs at 12-15 hrs/wk. Order below is priority order; the gated-content demo is first cut per the interview.

1. **Customer.io wiring + one real sequence** (6-8 hrs, ASSUMPTION). Essentials account, site events flowing via Track API from the Inngest pipeline, one live automated journey (e.g., a lead-magnet or newsletter-welcome sequence on ohmni.tech). Prospect sees: a journey triggered by their own test form submission arriving in their inbox during the call.
2. **Sample monthly report, template form** (3 hrs, ASSUMPTION). The $5k-tier artifact assembled from 30 days of real ohmni.tech data: narrative structure + PostHog/GSC/Otterly exhibits. Prospect sees: "this is the report you get every month," with real numbers in it.
3. **CHANGELOG.md rendered at a private URL** (3-4 hrs, ASSUMPTION). The allowance-tracking artifact. Prospect sees: every change you paid for, in your repo, forever.
4. **Record the Loom** (2-3 hrs, ASSUMPTION). The rehearsed walkthrough, recorded once tasks 1-4 are smooth and one sequence is live. Prospect sees: the async version of the demo, embeddable in outreach.
5. **Gated-content demo, Neon + Auth.js** (10-14 hrs, ASSUMPTION). CONDITIONAL: only if phase 1 shipped on time. First cut on slip. Prospect sees: the $12k-tier interactive-assets proof point, live.

---

## Phase 3: The factory (post-revenue, scoped, not scheduled)

- **DataForSEO + GSC reporting pipeline** (~40 hrs, ASSUMPTION): the owned rank/backlink/audit pipeline that replaces suite subscriptions, landing in the agency-side Neon reporting sink per the final report.
- **Generated report page**: the Next.js route that assembles the monthly report from live APIs, replacing the phase-2 doc template. Depends on the pipeline above.
- **Repo scan for solved problems**: request access to other repositories and mine them for template-worthy patterns. Look for: form/validation patterns, auth flows, webhook handlers, animation/visual components, schema patterns, anything solving a gap this plan lists. (Repo list to be provided; not enumerable from this session.)
- **Client-intake questionnaire flow**: Claude Code interviews a new client (or you on their behalf), optionally ingests existing design-system files, and emits the Task 7 brand config.
- **Design token architecture**: Style Dictionary layered over the shadcn/Tailwind/TweakCN structure so client theming is token-driven end to end.

## Backlog (explicitly deferred)

- Visual polish and Sanity UI library exploration.
- Server-side GTM (unjustified at current traffic per the final report).
- Screaming Frog license, SE Ranking, Scrunch, Dreamdata: buy when a client engagement demands each.
- Test suite / CI gate (build + lint + link check). Flagged in the report as an AI-safety floor; it protects future velocity rather than closing near-term deals, ASSUMPTION that solo discipline covers 60 days. First candidate to pull forward if a phase-1 task ships broken.
- `NEXT_PUBLICK_LOCAL_URL` typo cleanup and excluded-slugs dedup (fold into Task 7 if trivial).

## Financial summary

- New monthly spend: $129 (Otterly Lite $29, Customer.io Essentials $100), on top of existing Vercel/domain costs.
- Deferred spend: DataForSEO usage (~$40-55/mo), Screaming Frog ($259/yr), PDL enrichment key, all post-revenue.
- Two-month exposure: ~$258 of new tooling against the runway. Every other line in the final report's cost model activates only when a client pays for it.
