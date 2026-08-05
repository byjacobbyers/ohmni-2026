import { MasterDetailIcon } from '@sanity/icons/MasterDetail'
import type { DocumentActionComponent } from 'sanity'
import { getPublicSiteUrl } from '@/lib/site-url'

const SECTION_DOC_TYPES = new Set(['page', 'post', 'event'])

const siteOrigin =
  process.env.SANITY_STUDIO_PREVIEW_ORIGIN?.replace(/\/+$/, '') || getPublicSiteUrl()

/**
 * Opens the live section playground so editors can preview layouts/variants.
 */
export const browseSectionGalleryAction: DocumentActionComponent = (props) => {
  if (!SECTION_DOC_TYPES.has(props.type)) {
    return null
  }

  return {
    label: 'Browse section gallery',
    icon: MasterDetailIcon,
    onHandle: () => {
      window.open(`${siteOrigin.replace(/\/$/, '')}/design/sections`, '_blank', 'noopener,noreferrer')
      props.onComplete()
    },
  }
}
