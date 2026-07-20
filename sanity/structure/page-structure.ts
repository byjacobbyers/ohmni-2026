import type { StructureBuilder } from 'sanity/structure'
import {PresentationIcon} from '@sanity/icons/Presentation'

const Page = (S: StructureBuilder) =>
  S.listItem()
    .title('Pages')
    .icon(PresentationIcon)
    .child(
      S.documentList()
        .title('Pages')
        .apiVersion('v2025-02-19')
        .menuItems(S.documentTypeList('page').getMenuItems())
        .filter('_type == "page"')
        .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
    )

export default Page
