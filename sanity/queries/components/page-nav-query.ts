import { groq } from 'next-sanity'
import { routeQuery } from '../objects/route-query'

/**
 * Nav items are either a plain route or a subNav that opens a dropdown.
 * `_type` is projected so the renderer can branch without guessing.
 */
const navItemsQuery = groq`
  items[] {
    _key,
    _type,
    _type == "route" => {
      ${routeQuery}
    },
    _type == "subNav" => {
      title,
      display,
      items[] {
        _key,
        description,
        icon,
        route {
          ${routeQuery}
        }
      }
    }
  }
`

/** `$id` is `header` or `header--es`; see localizedId in lib/translate.ts. */
export const headerQuery = groq`
  *[_type == "navigation" && _id == $id][0] {
    title,
    ${navItemsQuery}
  }
`

export const footerQuery = groq`
  *[_type == "navigation" && _id == $id][0] {
    title,
    ${navItemsQuery}
  }
`
