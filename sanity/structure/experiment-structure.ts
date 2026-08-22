import type { StructureBuilder } from 'sanity/structure'
import { SplitVerticalIcon } from '@sanity/icons/SplitVertical'

const Experiment = (S: StructureBuilder) =>
  S.listItem()
    .title('Experiments')
    .icon(SplitVerticalIcon)
    .child(
      S.documentList()
        .title('Experiments')
        .apiVersion('v2025-02-19')
        .menuItems(S.documentTypeList('experiment').getMenuItems())
        .filter('_type == "experiment"')
        .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
    )

export default Experiment
