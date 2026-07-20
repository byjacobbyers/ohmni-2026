import type { DividerBlockProps } from '@/types/components/divider-block-type'

export default function DividerBlock({
  active = true,
  size = 'medium',
  style = 'rule',
}: DividerBlockProps & { style?: 'rule' | 'gap' | string }) {
  if (active === false) return null

  const padding =
    size === 'small'
      ? 'py-4'
      : size === 'medium'
        ? 'py-8'
        : size === 'large'
          ? 'py-16 md:py-24'
          : size === 'zero'
            ? 'py-0'
            : 'py-8'

  const gapHeight =
    size === 'small' ? 'h-8' : size === 'large' ? 'h-24' : size === 'zero' ? 'h-0' : 'h-12'

  if (style === 'gap') {
    return <div className={`w-full ${gapHeight}`} aria-hidden="true" />
  }

  return (
    <div className={`w-full ${padding}`}>
      <hr className="border-t border-border" />
    </div>
  )
}
