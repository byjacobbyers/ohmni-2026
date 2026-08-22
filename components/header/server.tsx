import { sanityFetch } from '@/sanity/lib/live'
import { SiteQuery } from '@/sanity/queries/documents/site-query'
import { headerQuery } from '@/sanity/queries/components/page-nav-query'
import { resolveBrand } from '@/lib/brand'
import HeaderClient from '@/components/header/client'
import type { HeaderProps } from '@/types/components/header-type'
import type { SiteType } from '@/lib/seo'
import { localizedId } from '@/lib/translate'
import type { Locale } from '@/lib/i18n'

/**
 * Server shell for the site header — fetches nav + brand like posts-block/server,
 * then renders the interactive client island.
 */
export default async function HeaderServer({ lang = 'en' }: { lang?: Locale }) {
  const [navRes, siteRes] = await Promise.all([
    // Spanish nav is `header--es`; until it exists the English one stands in.
    sanityFetch({ query: headerQuery, params: { id: localizedId('header', lang) } }).then((res) =>
      res.data || lang === 'en' ? res : sanityFetch({ query: headerQuery, params: { id: 'header' } })
    ),
    sanityFetch({ query: SiteQuery, stega: false }),
  ])
  const navigation = navRes.data as HeaderProps['navigation']
  const resolved = resolveBrand(siteRes.data as SiteType | null)

  return (
    <HeaderClient
      navigation={navigation}
      brandName={resolved.name}
      brandTagline={resolved.tagline}
      lang={lang}
    />
  )
}
