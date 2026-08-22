import { groq } from 'next-sanity'
import { routeQuery } from '../objects/route-query'

export const AnnouncementQuery = groq`
  *[_type == "announcement" && active == true && startDate <= $today && endDate >= $today && coalesce(language, "en") == $lang][0] {
    _id,
    message,
    route {
      ${routeQuery}
    }
  }
`
