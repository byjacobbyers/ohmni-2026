import type { StructureBuilder } from 'sanity/structure'
import {PresentationIcon} from '@sanity/icons/Presentation'

const list = (S: StructureBuilder, title: string, filter: string) =>
  S.documentList()
    .title(title)
    .apiVersion('v2025-02-19')
    .menuItems(S.documentTypeList('page').getMenuItems())
    .filter(filter)
    .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])

const Page = (S: StructureBuilder) =>
  S.listItem()
    .title('Pages')
    .icon(PresentationIcon)
    .child(
      S.list()
        .title('Pages')
        .items([
          S.listItem()
            .title('English')
            .icon(PresentationIcon)
            .child(list(S, 'Pages (English)', '_type == "page" && coalesce(language, "en") == "en"')),
          S.listItem()
            .title('Español')
            .icon(PresentationIcon)
            .child(list(S, 'Pages (Español)', '_type == "page" && language == "es"')),
        ])
    )

export default Page
