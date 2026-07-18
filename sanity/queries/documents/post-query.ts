import { groq } from 'next-sanity'
import { imageQuery } from '../objects/image-query'
import { sectionsQuery } from '../components/sections-query'
import { teamPersonProjection } from './team-query'

export const postsQuery = groq`*[_type == "post"] | order(publishedAt desc) {
  _id,
  _type,
  title,
  "slug": slug.current,
  publishedAt,
  author-> ${teamPersonProjection},
  category,
  excerpt,
  image { ${imageQuery} }
}`

export const postQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  _type,
  _updatedAt,
  title,
  slug,
  image { ${imageQuery} },
  publishedAt,
  author-> ${teamPersonProjection},
  category,
  excerpt,
  seo {
    ...,
    shareGraphic { ${imageQuery} }
  },
  jsonLd,
  ${sectionsQuery}
}`
