# New document type checklist

The block-level version of this lives in `new-section-checklist.md`. This is the
pipeline for a new **document** `_type`.

1. **Schema** — `sanity/schemas/documents/*-schema.ts`, icon and preview
   included. Register in `sanity/schemas/index.ts`.
2. **Studio structure** — `sanity/structure/*-structure.ts`, added to the list
   in `structure/index.ts`. Otherwise editors cannot find it.
3. **Query** — `sanity/queries/documents/*-query.ts`. Reuse existing fragments
   (`sectionsQuery`, `imageQuery`, `routeQuery`) rather than re-projecting.
4. **Types** — run `pnpm typegen` and import the generated result type.
   `sanityFetch`'s generic does not flow through interpolated fragments, so cast
   the result the way `app/(site)/[slug]/page.tsx` does.
5. **Revalidation** — add a `case` to `getTargetsForDocument` in
   `lib/revalidate-targets.ts` **and a test**. Without it a publish falls
   through to the generic layout bust and the new route never updates. Send the
   slug as an object (`{current: "..."}`); the handler reads `slug?.current`.
6. **Route** — if it needs one.

## New route groups

A route group outside `(site)` inherits none of the site layout. It needs:

- `sans/mono/serif` variables and `globals.css` from `(site)/fonts` and
  `(site)/globals.css`
- the `#advanced-texture` SVG filter, if any section on it uses a texture
  background
- **`<SanityLive />`.** Without it `sanityFetch` tags its responses and nothing
  ever revalidates them, so published edits never reach the page. This fails
  silently and looks exactly like a Next cache problem.
- `robots: { index: false, follow: false }` plus a `disallow` entry in
  `app/robots.ts` when the route should stay unlisted
