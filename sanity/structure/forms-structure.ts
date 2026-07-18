import type { StructureBuilder } from 'sanity/structure'
import {ClipboardIcon} from '@sanity/icons/Clipboard'
import {CogIcon} from '@sanity/icons/Cog'

export default function Forms(S: StructureBuilder) {
  return S.listItem()
    .title('Forms')
    .icon(ClipboardIcon)
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
            .icon(ClipboardIcon)
            .child(S.documentTypeList('form').title('Forms')),
        ])
    )
}
