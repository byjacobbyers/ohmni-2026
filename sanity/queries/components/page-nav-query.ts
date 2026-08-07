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

export const headerQuery = groq`
  *[_type == "navigation" && title == "Header"][0] {
    title,
    ${navItemsQuery}
  }
`

export const footerQuery = groq`
  *[_type == "navigation" && title == "Footer"][0] {
    title,
    ${navItemsQuery}
  }
`
