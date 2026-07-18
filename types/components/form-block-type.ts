export type FormBlockFormData = {
  name: string
  email: string
  message: string
  website?: string
}

export type FormBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  content?: unknown
}
