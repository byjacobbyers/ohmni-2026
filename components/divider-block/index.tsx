import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import { cn } from '@/lib/utils'
import type { DividerBlockProps } from '@/types/components/divider-block-type'

export default function DividerBlock({
  active = true,
  backgroundColor = 'primary',
  size = 'medium',
  style = 'rule',
}: DividerBlockProps & { style?: 'rule' | 'gap' | string }) {
  if (active === false) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, showTexture } = sectionBackgroundClasses(bg)

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
    return (
      <div
        className={cn('relative w-full', sectionClass, gapHeight)}
        aria-hidden="true"
      >
        {showTexture ? <TextureSectionBackdrop /> : null}
      </div>
    )
  }

  return (
    <div className={cn('relative w-full', sectionClass, padding)}>
      {showTexture ? <TextureSectionBackdrop /> : null}
      <hr className="relative z-10 border-t border-border" />
    </div>
  )
}
