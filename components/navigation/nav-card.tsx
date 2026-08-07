'use client'

import LucideIcon from '@/components/lucide-icon'
import Route from '@/components/route'
import { cn } from '@/lib/utils'
import type { NavLinkType } from '@/types/components/nav-type'

export type NavCardProps = {
  item: NavLinkType
  onNavigate?: () => void
  className?: string
}

/**
 * One dropdown destination: blue icon, title, one-line description.
 * Shared between the desktop panel and the mobile menu, so the two cannot
 * drift. Solid card surface rather than the translucent one used by column
 * cards, because these sit over the texture backdrop.
 */
export default function NavCard({ item, onNavigate, className }: NavCardProps) {
  if (!item?.route) return null
  const title = item.route.title || 'Link'

  return (
    <Route
      data={item.route}
      onClick={onNavigate}
      className={cn(
        'group flex w-full items-start gap-3 border border-border bg-card p-2.5 text-left no-underline transition-colors lg:p-4',
        'hover:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
        'motion-reduce:transition-none',
        className
      )}
    >
      {/* Colour lives on the svg, not the wrapper: the shadcn link style forces
          text-muted-foreground onto any nested svg without a text- class. */}
      {item.icon ? (
        <span className="mt-0.5 flex-none">
          <LucideIcon name={item.icon} className="text-primary" />
        </span>
      ) : null}
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-base leading-tight font-semibold text-foreground">
          {title}
        </span>
        {item.description ? (
          <span className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </span>
        ) : null}
      </span>
    </Route>
  )
}
