'use client'

import { motion } from 'motion/react'
import SimpleText from '@/components/simple-text'
import SanityImage from '@/components/sanity-image'
import Radar from '@/components/animations/radar'
import LetterGlitch from '@/components/animations/letter-glitch'
import FaultyTerminal from '@/components/animations/faulty-terminal'
import type {
  ProblemBlockColumn,
  ProblemBlockIcon,
  ProblemBlockProps,
} from '@/types/components/problem-block-type'

function ProblemIconVisual({ icon }: { icon: ProblemBlockIcon }) {
  const shell =
    'relative h-12 w-12 shrink-0 overflow-hidden rounded-full pointer-events-none border border-destructive'

  switch (icon) {
    case 'LuClock':
      return (
        <div className={shell} aria-hidden>
          <div className="absolute inset-0 size-full min-h-12 min-w-12">
            <Radar
              speed={0.2}
              scale={0.5}
              ringCount={10}
              spokeCount={10}
              ringThickness={0.05}
              spokeThickness={0.01}
              sweepSpeed={0.3}
              sweepWidth={2}
              sweepLobes={1}
              color="#EF4444"
              backgroundColor="#000000"
              falloff={2}
              brightness={1}
              enableMouseInteraction={false}
              mouseInfluence={0.1}
            />
          </div>
        </div>
      )
    case 'LuCode':
      return (
        <div className={shell} aria-hidden>
          <LetterGlitch
            glitchColors={['#f97316', '#f43f5e', '#3b82f6']}
            glitchSpeed={50}
            centerVignette={false}
            outerVignette={true}
            smooth
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789"
          />
        </div>
      )
    case 'LuLayers':
      return (
        <div className={shell} aria-hidden>
          <FaultyTerminal
            className="absolute inset-0 size-full min-h-12 min-w-12"
            scale={2.1}
            gridMul={[2, 1]}
            digitSize={1}
            timeScale={0.5}
            pause={false}
            scanlineIntensity={0.5}
            glitchAmount={1}
            flickerAmount={1}
            noiseAmp={1}
            chromaticAberration={0}
            dither={0}
            curvature={0.1}
            tint="#EF4444"
            mouseReact={false}
            mouseStrength={0.5}
            pageLoadAnimation={false}
            brightness={1}
          />
        </div>
      )
    default:
      return null
  }
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
