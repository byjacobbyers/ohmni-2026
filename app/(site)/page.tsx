import { notFound } from 'next/navigation'
import Page from '@/components/page-single'
import {
  fetchPage,
  JsonLdScript,
  pageSeoMetadata,
  webPageSchemas,
} from '@/lib/content-page'

export const generateMetadata = async () =>
  pageSeoMetadata({ slug: 'home', url: '/', fallbackTitle: undefined })

export default async function Home() {
  let page
  try {
    page = await fetchPage('home')
  } catch {
    notFound()
  }

  if (!page) notFound()

  return (
    <>
      <JsonLdScript
        id="home-jsonld"
        schemas={webPageSchemas({ ...page, seo: undefined }, '/')}
      />
      <Page page={page} key={page._id} />
    </>
  )
}
