import { sanityFetch } from '@/sanity/lib/live'
import { SiteQuery } from '@/sanity/queries/documents/site-query'
import { footerQuery } from '@/sanity/queries/components/page-nav-query'
import { resolveBrand } from '@/lib/brand'
import Footer from '@/components/footer/footer'
import type { FooterProps } from '@/types/components/footer-type'
import type { SiteType } from '@/lib/seo'

/**
 * Server shell for the site footer — fetches nav + brand on the server.
 * Footer markup stays an RSC; only Route / cookie trigger are client leaves.
 */
export default async function FooterServer() {
  const [navRes, siteRes] = await Promise.all([
    sanityFetch({ query: footerQuery }),
    sanityFetch({ query: SiteQuery, stega: false }),
  ])
  const navigation = navRes.data as FooterProps['navigation']
  const resolved = resolveBrand(siteRes.data as SiteType | null)

  return <Footer navigation={navigation} brandName={resolved.name} />
}
