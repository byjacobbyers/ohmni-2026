import type { StructureBuilder } from 'sanity/structure'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {CogIcon} from '@sanity/icons/Cog'

export default function Forms(S: StructureBuilder) {
  return S.listItem()
    .title('Forms')
    .icon(DocumentTextIcon)
    .child(
      S.list()
        .title('Forms')
        .items([
          S.listItem()
            .title('Form Settings')
            .icon(CogIcon)
            .child(
              S.editor()
                .id('formSettings')
                .schemaType('formSettings')
                .documentId('formSettings')
            ),
          S.divider(),
          S.listItem()
            .title('All Forms')
            .icon(DocumentTextIcon)
            .child(S.documentTypeList('form').title('Forms')),
        ])
    )
}
