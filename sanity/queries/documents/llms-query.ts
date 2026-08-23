import { groq } from 'next-sanity'

/** Everything the llms.txt index needs, one round trip. Published only; noindex pages excluded. */
export const llmsIndexQuery = groq`{
  "site": *[_type == "site"][0]{ altTitle, title, "summary": coalesce(organizationJsonLd.description, seo.metaDesc), "homeDescription": seo.metaDesc },
  "nav": *[_type == "navigation" && _id in ["header", "header--es"]]{
    "lang": coalesce(language, "en"),
    "groups": items[]{
      _type == "subNav" => { title, "items": items[]{ description, "slug": route.pageRoute->slug.current } },
      _type == "route" => { "title": "", "items": [{ description, "slug": pageRoute->slug.current }] }
    }
  },
  "pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true && !(_id in path("drafts.**"))] | order(title asc){
    "slug": slug.current, "language": coalesce(language, "en"), title, "description": seo.metaDesc
  },
  "posts": *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc){
    "slug": slug.current, "language": coalesce(language, "en"), title, excerpt, publishedAt
  }
}`

/** Slugs per language, for llms-full.txt. */
export const llmsDocumentsQuery = groq`{
  "pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true && !(_id in path("drafts.**"))]{ "slug": slug.current, "language": coalesce(language, "en") },
  "posts": *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current, "language": coalesce(language, "en") }
}`
