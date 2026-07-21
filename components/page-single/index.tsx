import Sections from '@/components/sections'
import { secondarySectionClass } from '@/lib/section-background'
import type { PageQueryResult } from '@/sanity.types'

export default function Page({ page }: { page: PageQueryResult }) {
  if (!page) return null
  const { sections = [], backgroundColor = 'primary' } = page
  const bgClass = secondarySectionClass(backgroundColor ?? undefined)
  return (
    <main className={`flex min-h-screen flex-col items-center ${bgClass}`}>
      <Sections body={sections ?? undefined} />
    </main>
  )
}
