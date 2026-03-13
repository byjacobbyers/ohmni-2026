import { SanityDocument } from "next-sanity"
import Sections from "@/components/sections"

export default function Page({ page }: { page: SanityDocument }) {
  if (!page) return null
  const { sections = [], backgroundColor = 'primary' } = page
  const bgClass = backgroundColor === 'secondary' ? 'bg-accent' : ''
  return (
    <main className={`flex min-h-screen flex-col items-center justify-center gap-y-24 ${bgClass}`}>
      <Sections body={sections} />
    </main>
  )
}
