# Ohmni — agent notes

Project instructions are split under [`.claude/rules/`](.claude/rules/). Claude Code loads every `*.md` there automatically (recursively). Keep this file thin—add new topics as separate rule files, not more sections here.

| File | Topic |
|------|--------|
| `prefer-existing-sections.md` | Reuse page-builder blocks before inventing new ones |
| `content-ask-before-new.md` | Content work: use existing blocks; ask before new components/code |
| `tokens-and-styling.md` | Tokens, theme utilities, shadcn/ui |
| `tweakcn-theme.md` | Theme from tweakcn — edit `tokens/`, re-import workflow |
| `section-composition.md` | Section/container shell, motion, backgrounds |
| `new-section-checklist.md` | Full pipeline when adding a new block `_type` |
| `design-gallery-registry.md` | The test that fails until a block is in the gallery, nav, snapshot map and thumbnails |
| `new-document-checklist.md` | Pipeline for a new document `_type`, and new route groups |
| `presentations.md` | Decks at `/present/{slug}`: screens, branching, what not to build |
| `experiments.md` | A/B on pages: experiment docs, edge cookie, variant hygiene |
| `branded-documents.md` | Emails, PDFs, invoices — brand palette, not site Tailwind |
| `ai-readability.md` | llms.txt, `.md` twins, the dynamic-for-measurement rule, the serializer gate |
| `internationalization.md` | Spanish at `/es`, same slug, `<id>--es` twins, fallback and hreflang rules |

**Adding a rule:** create `.claude/rules/<topic>.md`. Optional YAML frontmatter `paths:` scopes it to globs (only loads when matching files are in play).

**Cursor:** parallel always-on rules live in `.cursor/rules/*.mdc` (also local / gitignored). Project skills live in `.cursor/skills/` (e.g. `ohmni-parity`, `section-previews`).
