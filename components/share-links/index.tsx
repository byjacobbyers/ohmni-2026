'use client'

import { useState } from 'react'
import { Check, Link2, Mail } from 'lucide-react'
import { trackEvent } from '@/lib/gtm'
import { cn } from '@/lib/utils'

/** Brand marks: lucide v1 removed brand icons, so these are inlined. */
function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z" />
    </svg>
  )
}

export type ShareLinksProps = {
  /** Absolute URL of the thing being shared */
  url: string
  title: string
  className?: string
}

/**
 * Share row for articles. Native intents only, no third-party widgets: those
 * load trackers and would undercut the first-party analytics posture.
 */
export default function ShareLinks({ url, title, className }: ShareLinksProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const targets = [
    {
      key: 'linkedin',
      label: 'Share on LinkedIn',
      Icon: LinkedInIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      key: 'x',
      label: 'Share on X',
      Icon: XIcon,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      key: 'email',
      label: 'Share by email',
      Icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
  ]

  const itemClass =
    'flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none'

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      trackEvent('share_article', { method: 'copy_link', article: title })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked; the other share targets still work.
    }
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="mr-1 text-sm text-muted-foreground">Share</span>
      {targets.map(({ key, label, Icon, href }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={itemClass}
          onClick={() => trackEvent('share_article', { method: key, article: title })}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? 'Link copied' : 'Copy link'}
        className={itemClass}
      >
        {copied ? (
          <Check className="h-4 w-4 text-primary" aria-hidden />
        ) : (
          <Link2 className="h-4 w-4" aria-hidden />
        )}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  )
}
