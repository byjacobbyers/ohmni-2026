import { pageSeoMetadata, renderCmsPage } from '@/lib/content-page'

export const generateMetadata = () => pageSeoMetadata({ slug: 'home', lang: 'es' })

export default function HomeEs() {
  return renderCmsPage({ slug: 'home', lang: 'es', jsonLdId: 'home-jsonld' })
}
