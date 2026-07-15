export type PostType = {
  _id: string
  _type: 'post'
  title?: string
  slug?: { current?: string }
}
