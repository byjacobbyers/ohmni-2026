import AppearAnimation from '@/components/appear-animation'
import SanityImage from '@/components/sanity-image'
import SimpleText from '@/components/simple-text'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import type { TeamMemberBlockProps } from '@/types/components/team-member-block-type'
import type { SanityImageSource } from '@/types/components/sanity-image-type'

const SOCIAL_LABELS = [
  ['linkedin', 'LinkedIn'],
  ['x', 'X'],
  ['instagram', 'Instagram'],
  ['youtube', 'YouTube'],
  ['tiktok', 'TikTok'],
  ['facebook', 'Facebook'],
] as const

export default function TeamMemberBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  member,
}: TeamMemberBlockProps) {
  if (active === false || !member?.title) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)
  const sectionId = anchor || member.slug || `team-member-${componentIndex}`
  const jobLine = [member.primaryJobTitle, member.secondaryJobTitle]
    .filter(Boolean)
    .join(' · ')

  const socialLinks = SOCIAL_LABELS.flatMap(([key, label]) => {
    const href = member.socials?.[key]
    return typeof href === 'string' && href.trim()
      ? [{ key, label, href: href.trim() }]
      : []
  })

  return (
    <section
      id={sectionId}
      className={`team-member-block w-full flex justify-center px-5 py-16 md:py-24 ${sectionClass}`}
    >
      {showTexture ? <TextureSectionBackdrop /> : null}
      <AppearAnimation
        className={`container grid max-w-4xl gap-10 md:grid-cols-[minmax(0,14rem)_1fr] md:items-start ${innerLiftClass}`}
      >
        {member.image ? (
          <div className="relative mx-auto aspect-square w-full max-w-56 overflow-hidden rounded-md bg-muted">
            <SanityImage
              image={member.image as SanityImageSource}
              fill
              sizes="224px"
              className="object-cover object-center"
            />
          </div>
        ) : null}
        <div className="content flex flex-col gap-4 text-left">
          <div>
            <h2 className="mb-2">{member.title}</h2>
            {jobLine ? (
              <p className="text-lg text-muted-foreground">{jobLine}</p>
            ) : null}
          </div>
          {member.content ? <SimpleText content={member.content} /> : null}
          {(member.email || socialLinks.length > 0) && (
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {member.email ? (
                <li>
                  <a href={`mailto:${member.email}`} className="underline-offset-4 hover:underline">
                    {member.email}
                  </a>
                </li>
              ) : null}
              {socialLinks.map(({ key, label, href }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </AppearAnimation>
    </section>
  )
}
