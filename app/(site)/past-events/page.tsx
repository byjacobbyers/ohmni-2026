import EventsBlockServer from '@/components/events-block/server'
import { generateMetadata as generateSeoMetadata } from '@/lib/seo'

export const generateMetadata = async () =>
  generateSeoMetadata(undefined, undefined, 'Past Events', 'Past events archive.', {
    url: '/past-events',
  })

export default function PastEventsPage() {
  return (
    <article className="flex min-h-screen w-full flex-col items-center pb-12">
      <EventsBlockServer
        componentIndex={0}
        backgroundColor="primary"
        title="Past Events"
        listMode="past"
        count={12}
      />
    </article>
  )
}
