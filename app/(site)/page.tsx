import { pageSeoMetadata, renderCmsPage } from '@/lib/content-page'

export const generateMetadata = () => pageSeoMetadata({ slug: 'home' })

export default function Home() {
  return renderCmsPage({ slug: 'home', jsonLdId: 'home-jsonld' })
}
