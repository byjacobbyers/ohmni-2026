import { defineQuery } from 'next-sanity'
import { imageQuery } from '../objects/image-query'
import { sectionsQuery } from '../components/sections-query'

export const eventsQuery = defineQuery(`*[_type == "event" && defined(slug.current)] | order(startDate desc) {
  _id,
  _type,
  title,
  "slug": slug.current,
  startDate,
  endDate,
  timeString,
  "category": category->title,
  soldOut,
  location,
  image { ${imageQuery} }
}`)

export const eventQuery = defineQuery(`*[_type == "event" && slug.current == $slug][0] {
  _id,
  _type,
  _updatedAt,
  title,
  slug,
  image { ${imageQuery} },
  startDate,
  endDate,
  timeString,
  "category": category->title,
  soldOut,
  location,
  seo {
    ...,
    shareGraphic { ${imageQuery} }
  },
  jsonLd,
  ${sectionsQuery}
}`)
