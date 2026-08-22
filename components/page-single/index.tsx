import Sections from '@/components/sections'
import { secondarySectionClass } from '@/lib/section-background'
import type { Locale } from '@/lib/i18n'
import type { PageQueryResult } from '@/sanity.types'

export default function Page({ page, lang = 'en' }: { page: PageQueryResult; lang?: Locale }) {
  if (!page) return null
  const { sections = [], backgroundColor = 'primary' } = page
  const bgClass = secondarySectionClass(backgroundColor ?? undefined)
  return (
    <main className={`flex min-h-screen flex-col items-center ${bgClass}`}>
      <Sections body={sections ?? undefined} lang={lang} />
    </main>
  )
}
