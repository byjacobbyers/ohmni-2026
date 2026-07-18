'use client'

import { Button } from '@/components/ui/button'
import Route from '@/components/route'
import type { BaseRouteType } from '@/types/objects/route-type'

export type CtaRouteButtonProps = {
  route: BaseRouteType | Record<string, unknown>
  variant?: 'default' | 'outline' | 'secondary' | 'link' | 'huge'
  className?: string
  fallbackLabel?: string
}

/** Shared CTA leaf: Button + Route + title from the Sanity route object. */
export default function CtaRouteButton({
  route,
  variant = 'default',
  className,
  fallbackLabel = 'Learn More',
}: CtaRouteButtonProps) {
  const title =
    (typeof route === 'object' &&
      route &&
      'title' in route &&
      typeof route.title === 'string' &&
      route.title) ||
    fallbackLabel

  return (
    <Button asChild variant={variant} className={className}>
      <Route data={route as BaseRouteType}>{title}</Route>
    </Button>
  )
}
