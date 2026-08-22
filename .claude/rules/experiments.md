# Experiments (A/B on pages)

An experiment is an `experiment` document, not code. Assignment happens in
`proxy.ts` with an `ab_<key>` cookie; a variant is an ordinary page served by
rewrite, so the URL never changes and pages stay static.

- **Variant pages must set SEO → No index and canonical → the tested pathname.**
  The sitemap already drops noindex pages. Forgetting this ships a duplicate.
- **Variant `a` is the original page.** The proxy treats the first variant as
  "no rewrite".
- **`?ab=b` forces a variant; `?ab=reset` clears it.** Draft mode and crawler
  user agents are never assigned.
- **Measurement is PostHog's, assignment is ours.** The cookie becomes a
  `$feature/<key>` super property (client) and rides on `lead_submitted`
  (server), so conversions are attributable and survive ad blockers.
- **Never rename a key after launch.** It re-buckets everyone.
- Pure logic lives in `lib/experiments.ts` with tests. Keep `proxy.ts` thin.
