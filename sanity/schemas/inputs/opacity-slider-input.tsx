'use client'

import { NumberInputProps, set, unset } from 'sanity'
import { Stack, Flex, TextInput, Text, Box } from '@sanity/ui'
import { useCallback } from 'react'

type OpacitySliderInputProps = NumberInputProps & {
  min?: number
  max?: number
  step?: number
  unit?: string
}

/** Range slider + number input for 0–100 style values (e.g. overlay opacity). */
export default function OpacitySliderInput(props: OpacitySliderInputProps) {
  const { value, onChange, min = 0, max = 100, step = 1, unit = '%' } = props
  const current = typeof value === 'number' ? value : 50

  const handleSliderChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = parseInt(event.currentTarget.value, 10)
      onChange(Number.isFinite(next) ? set(next) : unset())
    },
    [onChange]
  )

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.currentTarget.value
      if (raw === '') {
        onChange(unset())
        return
      }
      const next = parseInt(raw, 10)
      if (!Number.isNaN(next) && next >= min && next <= max) {
        onChange(set(next))
      }
    },
    [onChange, min, max]
  )

  return (
    <Stack space={2}>
      <Flex gap={3} align="center">
        <Box flex={1}>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={current}
            onChange={handleSliderChange}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              outline: 'none',
              cursor: 'pointer',
            }}
          />
        </Box>
        <Flex gap={1} align="center">
          <TextInput
            type="number"
            min={min}
            max={max}
            value={current}
            onChange={handleTextChange}
            style={{ width: '70px' }}
          />
          <Text size={1} muted>
            {unit}
          </Text>
        </Flex>
      </Flex>
    </Stack>
  )
}
