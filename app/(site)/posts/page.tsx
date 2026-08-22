import { pageSeoMetadata, renderCmsPage } from '@/lib/content-page'

export const generateMetadata = () =>
  pageSeoMetadata({ slug: 'posts', fallbackTitle: 'Posts' })

export default function PostsIndexPage() {
  return renderCmsPage({ slug: 'posts', jsonLdId: 'posts-jsonld' })
}
