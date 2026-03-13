'use client'

type DividerBlockProps = {
  active?: boolean
  size?: string
}

export default function DividerBlock({ active = true, size = 'zero' }: DividerBlockProps) {
  if (!active) return null

  const padding = size === 'small' ? 'py-4' : size === 'medium' ? 'py-8' : size === 'large' ? 'py-12' : 'py-0'

  return (
    <div className={`w-full ${padding}`}>
      <hr className="border-t border-border" />
    </div>
  )
}
