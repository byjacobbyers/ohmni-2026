export type PostCard = {
  _id: string
  title?: string
  slug?: string
  publishedAt?: string
  author?: string
  category?: string
  excerpt?: string
  image?: unknown
}

export type PostsBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: string
  title?: string
  count?: number
  columnsPerRow?: number
  posts?: PostCard[]
}
