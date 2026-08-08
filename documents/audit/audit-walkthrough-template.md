# Free Site Audit: deliverable and walkthrough template

The spec for what a prospect receives after requesting an audit at
`ohmni.tech/free-site-audit`, and how the 15 minute walkthrough runs.

Sections marked **INSERT** are yours to fill with the tests you actually run.
Everything else is structure that should stay constant so every audit looks
like it came from the same practice.

---

## Rules this deliverable has to honor

These come from the audit page copy, which is a promise already made in public:

- **Plain language.** The reader is a marketing leader, not an engineer.
- **Prioritized.** "What to fix first, what it is costing you, and what to ignore."
- **Theirs to keep.** "Yours to keep and act on with any team."
- **No retainer pitch.** The page says so explicitly. The deliverable ends with
  findings, not an offer. If the work is good the offer comes up on its own,
  and if it doesn't, the promise held.

That last rule is the one that will feel wrong in the moment. Keep it. The
audit's entire credibility rests on being genuinely free of an ask, and the
outreach message already spent the ask getting them here.

---

## The 15 minutes

| Time | What happens |
|---|---|
| 0:00 to 1:00 | What I looked at and what I did not |
| 1:00 to 3:00 | The three headline findings, stated as outcomes |
| 3:00 to 12:00 | Walk the sections, worst first |
| 12:00 to 14:00 | The punch list, and what to ignore |
| 14:00 to 15:00 | Hand over the doc. Questions. |

Lead with findings, not method. Nobody booked 15 minutes to hear about
Lighthouse. Method belongs in the written doc where they can check your work
later.

---

## Section 0: Scope

One short paragraph at the top of the written deliverable.

- URL audited, date, and which pages (home, one landing page, one blog post is
  a reasonable default)
- What is external-only, so nothing looks like a gap later. You did not have
  access to their CMS, CRM, analytics account, or automation tools.
- **INSERT:** your standard page-selection rule

---

## Section 1: Lead flow

> Maps to: **Speed to Lead** (`/speed-to-lead`)

**The business question:** when someone fills out a form, does the lead arrive,
and how long until a human responds?

This section is not on the audit page today. It needs to be, because the
outreach message now promises "every lead landing where it should." A prospect
who books off that line and gets no lead-flow finding will notice.

Everything here is observable without access.

Suggested tests:

- Submit their primary form with your real name, real email, real company.
  Record the exact timestamp. Do not invent a persona; a fake record in their
  CRM right before you talk to them is not worth it.
- At submit time, in devtools: does the form actually POST, does a conversion
  event fire, are there JS errors, does it double-submit
- Time to auto-reply. Does one arrive at all, how fast, is it branded or a
  default template
- Time to first human contact, and on what channel
- Benchmark against one hour. Companies responding inside an hour were 60x more
  likely to qualify the lead than those past 24 hours
  ([HBR, 2011](https://hbr.org/2011/03/the-short-life-of-online-sales-leads),
  2,241 companies audited)
- **INSERT:** your own checks

How to report it: a timeline. "Submitted 2:14pm Tuesday. Auto-reply 2:14pm,
unbranded. First human contact: none as of Friday." A timeline needs no
interpretation.

**Cost this ~10 minutes plus a multi-day wait.** It is the most compelling
section and the least scalable. Run it on every audit, and factor it into how
many you accept.

---

## Section 2: Analytics and tracking health

> Maps to: **Analytics** (`/analytics`), "numbers that survive an ad blocker and a CFO"

**The business question:** are the numbers in their quarterly report real?

Suggested tests:

- Tag inventory: what is installed, and is anything installed twice
- Duplicate GTM containers or double-fired page views
- Consent Mode configuration, and what is lost when someone declines
- Ad blocker delta: load the site with and without a blocker, compare what
  reaches the endpoint. This is the number that makes CFOs sit up
- Does a conversion event actually fire on form submit, or is the goal
  configured against a thank-you URL that no longer exists
- Cross-domain and subdomain continuity, if they run an app on a subdomain
- **INSERT:** your own checks

How to report it: one sentence naming the size of the gap. "Roughly X% of your
sessions are not being counted" beats any screenshot of a tag manager.

---

## Section 3: AI search and structured data

> Maps to: **AI Search** (`/ai-search`), "be the source AI models cite"

**The business question:** when someone asks an AI assistant about their
category, can the model read their site well enough to quote them?

Suggested tests:

- Can a crawler read the page with JavaScript off, or is the content
  client-rendered into an empty shell
- Structured data present and valid: Organization, Article, FAQ, Product as
  relevant. Google Rich Results Test and the Schema.org validator
- `robots.txt` handling of AI crawlers: GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended. Many teams have blocked these by accident through a
  default config and do not know
- Sitemap presence and whether it reflects recently published pages
- Canonical tags, and whether paginated or filtered URLs are eating crawl budget
- **INSERT:** your own checks
- **INSERT, optional:** actually ask ChatGPT and Perplexity a category question
  and screenshot who gets cited. Nothing else in the audit lands like a
  competitor's name appearing where theirs should be

Note honestly where the ground is still moving. `llms.txt` is a proposal, not a
standard, and saying so builds more trust than presenting it as settled.

---

## Section 4: Performance and Core Web Vitals

> Supports the whole system, and is the section every competitor also runs

**The business question:** is the site fast enough that speed is not costing
them rankings or conversions?

Suggested tests:

- Field data from the Chrome UX Report, not just lab scores. Real users on real
  connections is the only version that matters
- LCP, INP, and CLS against the passing thresholds
- Where the time actually goes: third-party scripts, unoptimized images,
  render-blocking resources, font loading
- Mobile separately from desktop
- **INSERT:** your own checks

Keep this section short. It is the most commoditized thing in the audit, every
agency leads with it, and a Lighthouse score is the least surprising thing you
can hand someone. One paragraph, the two worst offenders, move on.

---

## Section 5: Publishing workflow

> Maps to: **Design Systems** (`/design-systems`), "every design decision made once, as code you own"

**The business question:** how long does a new landing page take to go live, and
who has to be involved?

This is the one section you cannot fully test from outside. Be upfront that part
of it is inference and part is a question for them.

Observable proxies:

- What CMS, and whether the front end suggests a visual editing setup or a
  developer deploy for every change
- Wayback Machine: how often does the site actually change, and does that match
  the publishing cadence they think they have
- Design consistency across pages. Count the button variants, the heading
  scales, the card treatments. Divergence is the visible symptom of decisions
  being re-made every sprint, and you have the Craft.co story for exactly this
- **INSERT:** your own checks

Ask on the call: "walk me through what happened last time you needed a new
landing page." The answer is usually the most quotable thing in the whole
15 minutes.

---

## The punch list

The artifact they keep. One table, ordered by impact, nothing else.

| # | Finding | What it costs | Effort | Who fixes it |
|---|---|---|---|---|

Rules that make it useful rather than impressive:

- **Five items maximum.** A list of thirty is a list of zero.
- **Cost in their terms.** Leads, budget, or reporting they cannot defend. Not
  milliseconds.
- **"Who fixes it" often says "your team" or "your current agency."** Say so
  when it is true. It is the single strongest trust signal in the document and
  it costs you nothing, because the ones that say otherwise say it credibly.

---

## What to ignore

A short named section, promised on the audit page and skipped by everyone else.

Two or three things that look like problems and are not worth their money right
now. A Lighthouse score of 78 that is fine because field data passes. A schema
warning with no bearing on anything. A page speed complaint caused by a tool
their sales team depends on.

This section is why they forward the document to their boss.

---

## Handoff

- Written doc, PDF, branded off `lib/brand-palette.ts` the same way the
  one-pager is
- Recorded walkthrough if async, live if they took the 15 minutes
- One line: what changed since the audit is worth a look in 90 days
- No offer. See the rules at the top.

---

## Before the first one goes out

- [ ] Add lead flow to `ohmni.tech/free-site-audit`. The page lists four areas
      and the outreach now promises a fifth.
- [ ] Fill every **INSERT** with the test you actually run, including the tool
      and what a pass looks like. If you cannot name the pass condition, the
      test is not ready.
- [ ] Run the whole thing on `ohmni.tech` first. The findings on your own site
      are the best sales asset you will ever have, and finding nothing means
      the audit is too shallow.
- [ ] Time yourself. If it takes four hours, the free audit is a pricing
      decision, not a marketing one.
