'use client'

import { Clock, Code2, Layers } from 'lucide-react'
import { motion } from 'motion/react'
import SimpleText from '@/components/simple-text'
import SanityImage from '@/components/sanity-image'
import type {
  ProblemBlockColumn,
  ProblemBlockIcon,
  ProblemBlockProps,
} from '@/types/components/problem-block-type'

function ProblemIconVisual({ icon }: { icon: ProblemBlockIcon }) {
  const shell =
    'relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-destructive text-destructive'

  const Icon =
    icon === 'LuClock' ? Clock : icon === 'LuCode' ? Code2 : icon === 'LuLayers' ? Layers : null

  if (!Icon) return null
  return (
    <div className={shell} aria-hidden>
      <Icon className="h-6 w-6" strokeWidth={1.75} />
    </div>
  )
}

function ProblemColumnVisual({ column }: { column: ProblemBlockColumn }) {
  if (column.image) {
    return (
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
        <SanityImage image={column.image} fill sizes="48px" className="object-contain" />
      </div>
    )
  }
  const key = column.icon as ProblemBlockIcon | undefined
  if (key === 'LuClock' || key === 'LuCode' || key === 'LuLayers') {
    return <ProblemIconVisual icon={key} />
  }
  return null
}

export default function ProblemBlock({
  active = true,
  componentIndex = 0,
  anchor,
  content,
  columns = [],
  excerpt,
}: ProblemBlockProps) {
  if (active === false || !columns?.length) return null

  return (
    <section
      id={anchor || `problem-block-${componentIndex}`}
      className="problem-block w-full px-5 py-16 md:py-24 flex justify-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container flex w-full flex-col items-center justify-center text-center"
      >
        {content && Array.isArray(content) && content.length > 0 ? (
          <div className="content mb-10 flex w-full justify-center text-balance">
            <SimpleText content={content} />
          </div>
        ) : null}

        <div className="flex w-full flex-wrap justify-center gap-x-6 gap-y-24 py-16 lg:mx-auto lg:max-w-[75vw] lg:flex-nowrap lg:justify-center">
          {columns.map((column, i) => (
            <div
              key={column._key ?? `problem-column-${i}`}
              className="mx-auto flex w-full max-w-md flex-col items-center gap-4 text-center sm:mx-0 sm:w-[calc(50%-0.75rem)] lg:mx-0 lg:w-auto lg:min-w-0 lg:max-w-none lg:flex-1 lg:basis-0"
            >
              <ProblemColumnVisual column={column} />
              {column.content && Array.isArray(column.content) ? (
                <div className="content max-w-sm flex w-full justify-center text-balance">
                  <SimpleText content={column.content} />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {excerpt && Array.isArray(excerpt) && excerpt.length > 0 ? (
          <div className="content mt-10 flex w-full justify-center">
            <SimpleText content={excerpt} />
          </div>
        ) : null}
      </motion.div>
    </section>
  )
}
