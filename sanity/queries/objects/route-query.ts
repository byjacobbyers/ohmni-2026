import { groq } from 'next-sanity'

/** Projection fragment only — not a standalone query. */
// @sanity-typegen-ignore
export const routeQuery = groq`
  _type,
  title,
  description,
  icon,
  linkType,
  pageRoute->{ _type, "slug": slug.current, "language": coalesce(language, "en") },
  eventRoute->{ _type, "slug": slug.current },
  postRoute->{ _type, "slug": slug.current, "language": coalesce(language, "en") },
  fileRoute { asset->{ url, originalFilename } },
  route,
  anchor,
  link,
  email,
  telephone,
  blank,
  titleAttr,
  ariaLabel,
  utm {
    source,
    medium,
    campaign,
    term,
    content
  },
  trackingId,
  relAttributes,
  dataAttributes[] {
    key,
    value,
    _key
  }
`
