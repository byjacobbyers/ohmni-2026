import type { SanityImageSource } from '@/types/components/sanity-image-type'
import { urlFor } from '@/sanity/lib/image'

/** Accepts page/post/event docs or site settings — anything with seo.shareGraphic. */
export function getShareGraphicRedirectUrl(
  doc: { seo?: { shareGraphic?: SanityImageSource | null } } | null
): string | null {
  const share = doc?.seo?.shareGraphic
  if (
    share &&
    typeof share === 'object' &&
    'asset' in share &&
    share.asset &&
    typeof share.asset === 'object' &&
    share.asset !== null &&
    'url' in share.asset &&
    typeof (share.asset as { url?: unknown }).url === 'string'
  ) {
    return urlFor(share as SanityImageSource).width(1200).height(630).url()
  }
  return null
}
