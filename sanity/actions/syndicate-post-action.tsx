import { useCallback, useState } from 'react'
import { ShareIcon } from '@sanity/icons/Share'
import { CopyIcon } from '@sanity/icons/Copy'
import { CheckmarkIcon } from '@sanity/icons/Checkmark'
import { Box, Button, Card, Flex, Stack, Text } from '@sanity/ui'
import type { DocumentActionComponent } from 'sanity'
import { getPublicSiteUrl } from '@/lib/site-url'

const siteOrigin =
  process.env.SANITY_STUDIO_PREVIEW_ORIGIN?.replace(/\/+$/, '') || getPublicSiteUrl()

const MEDIUM_IMPORT_URL = 'https://medium.com/p/import'

/**
 * UTM-tagged variants so PostHog can attribute audit requests to the channel
 * that produced them rather than lumping syndication into direct traffic.
 */
const TARGETS: { key: string; label: string; hint: string; params?: string }[] = [
  { key: 'canonical', label: 'Canonical URL', hint: 'The version that ranks. Use for the Medium import.' },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    hint: 'Put this in the first comment, not the post body.',
    params: 'utm_source=linkedin&utm_medium=social',
  },
  {
    key: 'medium',
    label: 'Medium',
    hint: 'Only needed if you link back manually.',
    params: 'utm_source=medium&utm_medium=syndication',
  },
  {
    key: 'substack',
    label: 'Substack',
    hint: 'For the CTA link in the email.',
    params: 'utm_source=substack&utm_medium=email',
  },
]

function readSlug(doc: unknown): string {
  const slug = (doc as { slug?: { current?: string } } | undefined)?.slug?.current
  return typeof slug === 'string' ? slug : ''
}

function SyndicatePanel({ url }: { url: string }) {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = useCallback(async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      window.setTimeout(() => setCopied(null), 2000)
    } catch {
      // Clipboard can be blocked; the URL is still visible to select by hand.
    }
  }, [])

  return (
    <Stack space={4}>
      {TARGETS.map(({ key, label, hint, params }) => {
        const full = params ? `${url}?${params}` : url
        return (
          <Stack space={2} key={key}>
            <Text size={1} weight="semibold">
              {label}
            </Text>
            <Text size={1} muted>
              {hint}
            </Text>
            <Card padding={2} radius={1} tone="transparent" border>
              <Flex align="center" gap={2}>
                <Box flex={1} style={{ overflowX: 'auto' }}>
                  <Text size={1} style={{ whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                    {full}
                  </Text>
                </Box>
                <Button
                  mode="ghost"
                  fontSize={1}
                  padding={2}
                  icon={copied === key ? CheckmarkIcon : CopyIcon}
                  text={copied === key ? 'Copied' : 'Copy'}
                  tone={copied === key ? 'positive' : 'default'}
                  onClick={() => copy(key, full)}
                />
              </Flex>
            </Card>
          </Stack>
        )
      })}

      <Card padding={3} radius={1} tone="primary" border>
        <Stack space={3}>
          <Text size={1} weight="semibold">
            Republish on Medium
          </Text>
          <Text size={1} muted>
            Copies the canonical URL and opens Medium&rsquo;s import tool, which sets rel=canonical
            back here so the copy never outranks the original. Wait until this post is indexed
            first, then paste. Medium has no way to prefill the field.
          </Text>
          <Button
            fontSize={1}
            padding={3}
            text="Copy URL and open Medium import"
            tone="primary"
            onClick={async () => {
              await copy('canonical', url)
              window.open(MEDIUM_IMPORT_URL, '_blank', 'noopener,noreferrer')
            }}
          />
        </Stack>
      </Card>
    </Stack>
  )
}

/**
 * Syndication helper for posts: channel-tagged links plus the Medium import hop.
 * Record the resulting URLs back on the document under Syndication.
 */
export const syndicatePostAction: DocumentActionComponent = (props) => {
  // Sanity invokes document actions as components, so hooks are the documented
  // way to drive a dialog here. The rule cannot infer that from the name.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, setOpen] = useState(false)

  if (props.type !== 'post') return null

  const slug = readSlug(props.published) || readSlug(props.draft)
  if (!slug) return null

  const url = `${siteOrigin.replace(/\/$/, '')}/posts/${slug}`

  return {
    label: 'Syndicate',
    icon: ShareIcon,
    onHandle: () => setOpen(true),
    dialog: open && {
      type: 'dialog',
      header: 'Syndicate this post',
      width: 'medium',
      onClose: () => {
        setOpen(false)
        props.onComplete()
      },
      content: <SyndicatePanel url={url} />,
    },
  }
}
