'use client'

import { Card, Stack, Text } from '@sanity/ui'
import type { StringFieldProps } from 'sanity'

/** Studio notice when page slug is `home` — SEO lives on Site Settings. */
export default function HomeSeoNoticeField(_props: StringFieldProps) {
  return (
    <Card padding={4} radius={2} shadow={1} tone="primary">
      <Stack space={3}>
        <Text size={2} weight="semibold">
          Please use global SEO for this page
        </Text>
        <Text size={1} muted>
          The home route uses Site Settings → SEO Defaults for title, description, and share
          images. Page-level SEO is disabled here.
        </Text>
      </Stack>
    </Card>
  )
}
