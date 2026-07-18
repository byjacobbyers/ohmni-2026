import { groq } from 'next-sanity'
import { imageQuery } from '../objects/image-query'
import { sectionsQuery } from '../components/sections-query'

export const eventsQuery = groq`*[_type == "event" && defined(slug.current)] | order(startDate desc) {
  _id,
  _type,
  title,
  "slug": slug.current,
  startDate,
  endDate,
  timeString,
  eventType,
  soldOut,
  location,
  image { ${imageQuery} }
}`

export const eventQuery = groq`*[_type == "event" && slug.current == $slug][0] {
  _id,
  _type,
  _updatedAt,
  title,
  slug,
  image { ${imageQuery} },
  startDate,
  endDate,
  timeString,
  eventType,
  soldOut,
  location,
  seo {
    ...,
    shareGraphic { ${imageQuery} }
  },
  ${sectionsQuery}
}`
