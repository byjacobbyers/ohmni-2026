import type { PortableTextBlock } from 'next-sanity'

export type TeamMemberData = {
  _id?: string
  title?: string
  slug?: string
  primaryJobTitle?: string
  secondaryJobTitle?: string
  email?: string
  phone?: string
  socials?: {
    facebook?: string
    linkedin?: string
    x?: string
    instagram?: string
    youtube?: string
    tiktok?: string
  }
  image?: unknown
  content?: PortableTextBlock[] | unknown
}

export type TeamMemberBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: string
  member?: TeamMemberData | null
}
