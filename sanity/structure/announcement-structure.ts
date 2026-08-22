import type { StructureBuilder } from 'sanity/structure'
import {BoltIcon} from '@sanity/icons/Bolt'

export default function Announcement(S: StructureBuilder) {
  return S.listItem()
    .title('Announcement')
    .icon(BoltIcon)
    .child(
      S.list()
        .title('Announcement')
        .items([
          S.listItem()
            .title('English')
            .icon(BoltIcon)
            .child(S.editor().id('announcement').schemaType('announcement').documentId('announcement')),
          S.listItem()
            .title('Español')
            .icon(BoltIcon)
            .child(
              S.editor().id('announcement--es').schemaType('announcement').documentId('announcement--es')
            ),
        ])
    )
}
