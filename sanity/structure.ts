import type {StructureResolver} from 'sanity/structure'

const HIDDEN_TYPES = ['media.tag', 'mux.videoAsset']

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items(
      S.documentTypeListItems().filter(
        (item) => !HIDDEN_TYPES.includes(item.getId() ?? '')
      )
    )
