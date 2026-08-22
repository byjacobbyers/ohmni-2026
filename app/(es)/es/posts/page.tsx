import { pageSeoMetadata, renderCmsPage } from '@/lib/content-page'

export const generateMetadata = () =>
  pageSeoMetadata({ slug: 'posts', lang: 'es', fallbackTitle: 'Artículos' })

export default function PostsIndexPageEs() {
  return renderCmsPage({ slug: 'posts', lang: 'es', jsonLdId: 'posts-jsonld' })
}
