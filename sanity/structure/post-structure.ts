import type { StructureBuilder } from 'sanity/structure'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

export default function Post(S: StructureBuilder) {
  return S.listItem()
    .title('Posts')
    .icon(DocumentTextIcon)
    .child(
      S.documentTypeList('post')
        .title('Posts')
        .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        .child((documentId) =>
          S.document().documentId(documentId).schemaType('post')
        )
    )
}
