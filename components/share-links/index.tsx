'use client'

import { useState } from 'react'
import { Check, Link2, Mail } from 'lucide-react'
import { trackEvent } from '@/lib/gtm'
import { cn } from '@/lib/utils'
import { LinkedInIcon, XIcon } from '@/components/social-icons'

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
