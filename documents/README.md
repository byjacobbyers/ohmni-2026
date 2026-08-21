# Branded documents

## Lead one-pager

One template, two PDFs that differ only in the Book a call link:

| File | CTA link | Use |
|------|----------|-----|
| `ohmni-one-pager.pdf` (also in `public/`, hosted at ohmni.tech/ohmni-one-pager.pdf) | calendly.com/ohmni/lets-talk | Jacob hands out / hosted link |
| `ohmni-one-pager-leadgen.pdf` (also in `public/`, hosted at ohmni.tech/ohmni-one-pager-leadgen.pdf) | calendly.com/ohmni/intro | Leadgen team attaches or links in outreach |

Edit `lead-one-pager.html` (colors from `lib/brand-palette.ts`), then regenerate both:

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --no-pdf-header-footer --print-to-pdf="documents/ohmni-one-pager.pdf" "file://$PWD/documents/lead-one-pager.html"
sed 's|calendly.com/ohmni/lets-talk|calendly.com/ohmni/intro|' documents/lead-one-pager.html > /tmp/one-pager-leadgen.html
"$CHROME" --headless=new --no-pdf-header-footer --print-to-pdf="documents/ohmni-one-pager-leadgen.pdf" "file:///tmp/one-pager-leadgen.html"
cp documents/ohmni-one-pager.pdf public/ohmni-one-pager.pdf
```

Keep it to one page: check with `python3 -c "import re;print(re.search(rb'/Count (\d+)',open('documents/ohmni-one-pager.pdf','rb').read()).group(1))"`.

## LinkedIn

| File | Purpose |
|------|---------|
| `linkedin/cover.html` | Banner source. Dark tokens + the site's `#advanced-texture` filter. |
| `linkedin/capture.mjs` | Renders the banner to PNG at 1584x396 @2x (`node documents/linkedin/capture.mjs`). |
| `linkedin/ohmni-linkedin-cover.png` | Upload target. Lower left is kept dark for the profile photo. |

## Audit

| File | Purpose |
|------|---------|
| `audit/audit-walkthrough-template.md` | Spec for the free site audit deliverable and the 15 minute walkthrough. Sections map to the four product pages. INSERT slots are the tests Jacob runs. |

## Deck diagrams

`design-system-images/diagrams/source.html` holds every diagram as a `.diagram`
block. `node documents/design-system-images/diagrams/capture.mjs` renders each
one to `{id}.png` at 2x. Add a block, add its id to `IDS`, re-run.
