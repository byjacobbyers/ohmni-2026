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
| `new-document-checklist.md` | Pipeline for a new document `_type`, and new route groups |
| `presentations.md` | Decks at `/present/{slug}`: screens, branching, what not to build |
| `branded-documents.md` | Emails, PDFs, invoices — brand palette, not site Tailwind |

**Adding a rule:** create `.claude/rules/<topic>.md`. Optional YAML frontmatter `paths:` scopes it to globs (only loads when matching files are in play).

**Cursor:** parallel always-on rules live in `.cursor/rules/*.mdc` (also local / gitignored). Project skills live in `.cursor/skills/` (e.g. `ohmni-parity`, `section-previews`).
