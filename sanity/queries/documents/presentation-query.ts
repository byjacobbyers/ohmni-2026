import { defineQuery } from 'next-sanity'
import { sectionsQuery } from '../components/sections-query'

/** Slugs plus screen identity only, for generateStaticParams. */
export const presentationRoutesQuery = defineQuery(`*[_type == "presentation" && defined(slug.current)] {
  "slug": slug.current,
  sections[] { _key, anchor }
}`)

export const presentationQuery = defineQuery(`*[_type == "presentation" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  ${sectionsQuery}
}`)
