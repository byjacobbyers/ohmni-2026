import { notFound } from 'next/navigation'
import Page from '@/components/page-single'
import {
  fetchPage,
  JsonLdScript,
  pageSeoMetadata,
  webPageSchemas,
} from '@/lib/content-page'

export const generateMetadata = async () =>
  pageSeoMetadata({ slug: 'posts', url: '/posts', fallbackTitle: 'Posts' })

export default async function PostsIndexPage() {
  let page
  try {
    page = await fetchPage('posts')
  } catch {
    notFound()
  }

  if (!page) notFound()

  return (
    <>
      <JsonLdScript id="posts-jsonld" schemas={webPageSchemas(page, '/posts')} />
      <Page page={page} key={page._id} />
    </>
  )
}
