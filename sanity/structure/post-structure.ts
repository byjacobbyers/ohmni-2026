import type { StructureBuilder } from 'sanity/structure'
import { DocumentTextIcon } from '@sanity/icons/DocumentText'
import { EnvelopeIcon } from '@sanity/icons/Envelope'
import { TagIcon } from '@sanity/icons/Tag'

export default function Post(S: StructureBuilder) {
  return S.listItem()
    .title('Posts')
    .icon(DocumentTextIcon)
    .child(
      S.list()
        .title('Posts')
        .items([
          S.listItem()
            .title('Post CTA Settings')
            .icon(EnvelopeIcon)
            .child(
              S.editor()
                .id('postCtaSettings')
                .schemaType('postCtaSettings')
                .documentId('postCtaSettings')
                .title('Post CTA Settings')
            ),
          S.divider(),
          S.listItem()
            .title('Post CTA Settings (Español)')
            .icon(EnvelopeIcon)
            .child(
              S.editor()
                .id('postCtaSettings--es')
                .schemaType('postCtaSettings')
                .documentId('postCtaSettings--es')
                .title('Post CTA Settings (Español)')
            ),
          S.divider(),
          S.listItem()
            .title('All posts')
            .icon(DocumentTextIcon)
            .child(
              S.documentTypeList('post')
                .title('Posts')
                .filter('_type == "post" && coalesce(language, "en") == "en"')
                .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                .child((documentId) =>
                  S.document().documentId(documentId).schemaType('post')
                )
            ),
          S.listItem()
            .title('Posts (Español)')
            .icon(DocumentTextIcon)
            .child(
              S.documentTypeList('post')
                .title('Posts (Español)')
                .filter('_type == "post" && language == "es"')
                .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                .child((documentId) =>
                  S.document().documentId(documentId).schemaType('post')
                )
            ),
          S.listItem()
            .title('Categories')
            .icon(TagIcon)
            .child(
              S.documentTypeList('postCategory')
                .title('Post categories')
                .defaultOrdering([{ field: 'title', direction: 'asc' }])
                .child((documentId) =>
                  S.document().documentId(documentId).schemaType('postCategory')
                )
            ),
        ])
    )
}
