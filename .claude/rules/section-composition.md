# Section composition

## Shell pattern (match existing blocks)

New sections should follow the same outer structure as peers (e.g. `form-block`, `hero-block`, `text-block`):

```tsx
<section className={`…-block w-full flex justify-center px-5 py-16 md:py-24 ${sectionClass}`}>
  {showTexture ? <TextureSectionBackdrop /> : null}
  <AppearAnimation className={`relative z-10 container … ${innerLiftClass}`}>
    {/* content */}
  </AppearAnimation>
</section>
```

- **Section** — full width, horizontal padding (`px-5`), vertical rhythm (`py-16 md:py-24` unless a peer block intentionally differs).
- **Container** — inner width via `container` (plus `max-w-*` only when matching a similar block).
- Copy a close existing block rather than inventing a new layout shell.

## Shared helpers

- **Backgrounds** — `normalizeSectionBackground` + `sectionBackgroundClasses` from `lib/section-background.ts`. Texture → `TextureSectionBackdrop` + `innerLiftClass`. No one-off bg stacks.
- **Copy** — Portable Text in `.content`. Prefer shared content spacing over custom prose hierarchies.
- **Motion** — Use `AppearAnimation` for entrance (and `scale` / delay when peers do). Prefer Motion (`motion/react`) for any extra interaction; keep it purposeful (2–3 intentional moves), not decorative noise.
- **Design gallery** — Default-look changes → update `/design/sections` and `pnpm sections:previews` when insert thumbs should change.
