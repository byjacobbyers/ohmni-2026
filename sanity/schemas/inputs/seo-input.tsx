'use client'

import { ObjectInputProps, useFormValue } from 'sanity'
import { Stack, Text, Box } from '@sanity/ui'

export default function SeoInput(props: ObjectInputProps) {
  const { value } = props
  const document = useFormValue([]) as Record<string, unknown> | undefined

  const docTitle = (document?.title as string) || ''

  let docDescription = ''
  const rawDesc = document?.description
  if (Array.isArray(rawDesc)) {
    docDescription = rawDesc
      .map((block: { _type?: string; children?: { text?: string }[] }) => {
        if (block._type === 'block' && block.children) {
          return block.children.map((child) => child.text ?? '').join('')
        }
        return ''
      })
      .join(' ')
      .substring(0, 160)
  } else if (typeof rawDesc === 'string') {
    docDescription = rawDesc
  }

  const showTitleDefault = !value?.metaTitle && docTitle
  const showDescDefault = !value?.metaDesc && docDescription
  const hasNoDescription = !value?.metaDesc && !docDescription

  const docType = document?._type as string | undefined
  const shareGraphicHint =
    docType === 'site'
      ? 'This image is used when pages do not set their own share graphic.'
      : 'Image from Site Settings (or the built-in default if none is set there).'

  const descPreview =
    docDescription.length > 160
      ? `${docDescription.substring(0, 160)}…`
      : docDescription

  return (
    <Stack space={4}>
      <Box
        padding={3}
        style={{
          background: 'var(--card-bg-color)',
          borderRadius: '4px',
          border: '1px solid var(--card-border-color)',
        }}
      >
        <Stack space={2}>
          <Text size={1} weight="semibold">
            Defaults (if fields left empty):
          </Text>
          {showTitleDefault && (
            <Text size={1} muted>{`• Meta Title: "${docTitle}"`}</Text>
          )}
          {showDescDefault && (
            <Text size={1} muted>{`• Meta Description: "${descPreview}"`}</Text>
          )}
          {hasNoDescription && (
            <Text size={1} style={{ color: 'var(--card-badge-caution-fg-color)' }}>
              • Meta Description: No description found — add a description field to the
              document or fill in this field.
            </Text>
          )}
          <Text size={1} muted>
            • Share Graphic: {shareGraphicHint}
          </Text>
        </Stack>
      </Box>

      {props.renderDefault(props)}
    </Stack>
  )
}
