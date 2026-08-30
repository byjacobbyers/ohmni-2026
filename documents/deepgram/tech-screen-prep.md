# Tech screen prep: Next.js + Sanity + Vercel

Ten questions a screen could ask about the stack, each with what it is
really probing and the answer you can give from shipped work. Every answer
ends on something checkable on ohmni.tech, which is the advantage: you are
not describing a stack, you are demoing one. Then the security section,
including the gaps, because naming what the stack does not solve is the
senior answer.

---

## The ten questions

### 1. Walk me through what happens when someone submits a form.

**Probing:** whether you think in systems or in pages.

**Answer:** the front desk validates and stores the submission before any
integration runs, then drops it on a queue. Workers each do one job: CRM
record, welcome email, server-side analytics event, Slack ping,
notification. Every step retries with backoff, a permanent failure pages a
human, and a worker missing its API key skips cleanly instead of failing.
A vendor outage delays follow-up rather than losing it. Runs behind
ohmni.tech/free-site-audit today on Inngest.

### 2. Why Next.js for a marketing site instead of a SPA or a simpler stack?

**Probing:** do you choose tools for reasons.

**Answer:** marketing sites live or die on crawlability and first paint.
Server rendering means Google, ad scrapers and AI assistants get real HTML,
not an empty shell to hydrate. Static generation gives CDN speed, ISR and
revalidation keep content fresh without deploys, and middleware at the edge
enables things like A/B assignment with zero flicker. The honest tradeoff:
more moving parts than a static site generator, which is only worth it when
you use those parts. I use all three.

### 3. How does content get from Sanity to a page, and how do you keep it fast?

**Probing:** CMS depth beyond "I installed it."

**Answer:** typed GROQ queries project exactly the fields a section needs,
pages prerender at build, and publishes revalidate specific paths through a
signed webhook. Editors compose pages from a block library with live visual
editing. And the honest war story: cached data can survive a path
revalidation, and I diagnosed that by noticing a never-cached sibling page
rendered fresh while the cached one did not. Knowing where the caches
layer, build cache, data cache, CDN, is most of the job.

### 4. How would you run an A/B test without buying a testing platform?

**Probing:** edge/middleware understanding and measurement literacy.

**Answer:** an experiment is a CMS document: key, tested path, weighted
variants that are ordinary pages. Middleware assigns a sticky cookie once
and rewrites to the variant, so the URL never changes, both pages stay
static, and nothing flickers. The cookie rides on every analytics event and
on the server-side conversion, so results read out in PostHog and survive
ad blockers. One is live on my homepage now; ?ab=b forces the variant.

### 5. How do you take this stack international?

**Probing:** whether "i18n" means a library name or an architecture.

**Answer:** document-level translation, same slug across languages, locale
segment routes with their own root layout so the lang attribute is right in
the HTML. Reciprocal hreflang with x-default only where both languages
exist, sitemap alternates per URL, untranslated pages fall back to English
with a canonical so nothing indexes twice. Accept-Language suggests once
and never forces; country is not language. ohmni.tech/es shipped in an
evening because the content model made it possible.

### 6. What is wrong with client-side analytics, and what did you do about it?

**Probing:** measurement engineering, not tool operation.

**Answer:** roughly a third of visitors run ad blockers that eat tracking
scripts, so dashboards disagree and finance discounts both. I proxy
analytics through a first-party path so capture survives blockers, record
conversions server-side in the same pipeline that writes the CRM record,
and key both by the same id so every conversion reconciles one-to-one with
a CRM row. Consent still gates all of it: capture is opted out by default
until the banner grants it.

### 7. How do you make a site readable by AI assistants?

**Probing:** whether AEO is a buzzword or a practice.

**Answer:** server-rendered JSON-LD generated from the CMS, an explicit
robots decision about AI crawlers, llms.txt as a generated index, and a
Markdown twin of every page by appending .md to its URL, all built from the
same content the pages render, so it cannot drift. And honestly: llms.txt
is a proposal, not a standard; the durable value is clean served HTML and
the Markdown twins.

### 8. What does "design system" mean in this stack, concretely?

**Probing:** the difference between a style guide and enforcement.

**Answer:** four layers. Tokens as structured data compiled to CSS,
components built only from tokens so they cannot drift, templates marketers
compose, pages published from the CMS. Change a token and every page
updates without anyone opening one. A test suite fails if a block exists
without its playground, preview thumbnail and registration, so the system
is enforced by CI, not by a document people are asked to remember.

### 9. How do marketers ship without breaking things?

**Probing:** guardrails thinking; the actual job at Deepgram.

**Answer:** validation lives in the schema, so bad content cannot publish:
required fields, slug rules, weights that must sum to 100. Draft mode and
visual preview show changes before publish. The block library constrains
layout to approved patterns, so on-brand is the default, not an act of
discipline. The goal is a pit of success: the easy path and the correct
path are the same path.

### 10. Tell me about a production bug and how you found it.

**Probing:** debugging under ambiguity; honesty.

**Answer:** the form said "Thank you" and sent nothing. Cause: the hidden
honeypot field was named "website," and browser autofill filled it, so real
humans were classified as bots, silently. Diagnosis came from runtime logs
showing zero API calls while a real person submitted repeatedly. Fixes in
order: rename the field, move the decision server-side, log every trip so
the next false positive is visible, and finally readOnly on the input,
which is what actually stops autofill. Lesson: silent failure is the
expensive kind, so make failure loud.

---

## Security: what the stack addresses

Split by who does the work, because "Vercel handles it" and "I built it"
are different claims.

**The platform gives you:**
- TLS, DDoS absorption, immutable deploys with instant rollback (Vercel)
- Origin allowlist on the content API, dataset-scoped tokens (Sanity)
- React escapes output by default, which closes most XSS at the root

**Built in this stack, checkable in the repo:**
- **Webhook forgery:** the revalidation endpoint verifies a timestamped
  HMAC signature; an unsigned or replayed publish is rejected.
- **Injection:** GROQ queries are parameterized; no string-built queries.
- **Secret discipline:** server-only env vars, a strict NEXT_PUBLIC
  boundary, read-scoped tokens where read is enough, and the translate
  endpoint holds no write token at all: writes happen with the editor's own
  Studio session.
- **Abuse control:** server-side honeypot with logging, per-IP rate
  limiting, and same-origin checks on endpoints that cost money.
- **Cookie hygiene:** SameSite=Lax, no PII in cookies (variant keys and a
  language code), nothing sensitive in URLs.
- **Privacy as architecture:** analytics opted out by default, consent
  gates capture and identify, revoking consent also deletes the stored
  visitor identity. GDPR posture by construction, not by banner.
- **Supply chain:** lockfile, deliberately few dependencies, UI primitives
  vendored into the repo rather than pulled at runtime.

**The honest gaps, if asked what I would harden next:**
- No Content-Security-Policy header yet; GTM makes a strict one hard, and
  any tag manager is third-party code on your origin. On a stack I owned
  fully I would move toward server-side tagging and a real CSP.
- The rate limiter is in-memory per serverless instance: fine against
  casual abuse, not against a distributed attacker. Upgrade path is a
  shared store.
- No subresource integrity on third-party scripts, same GTM caveat.

Saying the gaps out loud is the point: a candidate who claims a stack has
no security debt is describing a stack they do not understand.
