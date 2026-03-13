'use client'

type SpacerBlockProps = {
  active?: boolean
  size?: string
}

export default function SpacerBlock({ active = true, size = 'medium' }: SpacerBlockProps) {
  if (!active) return null

  const height = size === 'small' ? 'h-8' : size === 'large' ? 'h-24' : 'h-12'

  return <div className={`w-full ${height}`} aria-hidden="true" />
}
