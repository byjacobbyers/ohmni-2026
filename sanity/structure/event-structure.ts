import type { StructureBuilder } from 'sanity/structure'
import { CalendarIcon } from '@sanity/icons/Calendar'
import { TagIcon } from '@sanity/icons/Tag'

export default function Event(S: StructureBuilder) {
  return S.listItem()
    .title('Events')
    .icon(CalendarIcon)
    .child(
      S.list()
        .title('Events')
        .items([
          S.listItem()
            .title('All events')
            .icon(CalendarIcon)
            .child(
              S.documentTypeList('event')
                .title('Events')
                .defaultOrdering([{ field: 'startDate', direction: 'desc' }])
                .child((documentId) =>
                  S.document().documentId(documentId).schemaType('event')
                )
            ),
          S.listItem()
            .title('Categories')
            .icon(TagIcon)
            .child(
              S.documentTypeList('eventCategory')
                .title('Event categories')
                .defaultOrdering([{ field: 'title', direction: 'asc' }])
                .child((documentId) =>
                  S.document().documentId(documentId).schemaType('eventCategory')
                )
            ),
        ])
    )
}
