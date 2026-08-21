import type { StructureBuilder } from 'sanity/structure'
import { PlayIcon } from '@sanity/icons/Play'

const Presentation = (S: StructureBuilder) =>
  S.listItem()
    .title('Presentations')
    .icon(PlayIcon)
    .child(
      S.documentList()
        .title('Presentations')
        .apiVersion('v2025-02-19')
        .menuItems(S.documentTypeList('presentation').getMenuItems())
        .filter('_type == "presentation"')
        .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
    )

export default Presentation
