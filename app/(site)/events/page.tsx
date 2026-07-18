import { notFound } from 'next/navigation'
import Page from '@/components/page-single'
import {
  fetchPage,
  JsonLdScript,
  pageSeoMetadata,
  webPageSchemas,
} from '@/lib/content-page'

export const generateMetadata = async () =>
  pageSeoMetadata({ slug: 'events', url: '/events', fallbackTitle: 'Events' })

export default async function EventsIndexPage() {
  let page
  try {
    page = await fetchPage('events')
  } catch {
    notFound()
  }

  if (!page) notFound()

  return (
    <>
      <JsonLdScript id="events-jsonld" schemas={webPageSchemas(page, '/events')} />
      <Page page={page} key={page._id} />
    </>
  )
}
