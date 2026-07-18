import { SanityDocument } from "next-sanity"
import Sections from "@/components/sections"
import { secondarySectionClass } from "@/lib/section-background"

export default function Page({ page }: { page: SanityDocument }) {
  if (!page) return null
  const { sections = [], backgroundColor = 'primary' } = page
  const bgClass = secondarySectionClass(backgroundColor)
  return (
    <main className={`flex min-h-screen flex-col items-center ${bgClass}`}>
      <Sections body={sections} />
    </main>
  )
}
