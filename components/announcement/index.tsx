'use client'

import Route from '@/components/route'
import { Button } from '@/components/ui/button'
import type { AnnouncementType } from '@/types/documents/announcement-type'

type AnnouncementBarProps = {
  announcement: AnnouncementType | null
}

export default function AnnouncementBar({ announcement }: AnnouncementBarProps) {
  const message = announcement?.message?.trim()
  if (!message || !announcement) return null

  const route = announcement.route
  const showCta = Boolean(route?.linkType)
  const ctaLabel = route?.title?.trim() || 'Learn more'

  return (
    <div
      className="flex w-full shrink-0 justify-center px-5 pt-2 pb-1"
      role="region"
      aria-label="Site announcement"
    >
      <div className="container">
        <div className="flex flex-nowrap items-center justify-between gap-2 rounded-xl border border-primary bg-primary px-6 py-1 text-primary-foreground md:justify-center md:gap-4 sm:flex-row">
          <p className="max-w-prose text-balance text-sm">{message}</p>
          {showCta && route ? (
            <Button asChild variant="secondary" size="sm" className="shrink-0">
              <Route data={route}>{ctaLabel}</Route>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
