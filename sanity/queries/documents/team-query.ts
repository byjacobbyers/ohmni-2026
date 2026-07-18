import { groq } from 'next-sanity'
import { imageQuery } from '../objects/image-query'

/** Shared projection for team → Person JSON-LD / UI. */
export const teamPersonProjection = groq`{
  _id,
  title,
  "slug": slug.current,
  primaryJobTitle,
  secondaryJobTitle,
  email,
  phone,
  socials,
  image { ${imageQuery} },
  content
}`
