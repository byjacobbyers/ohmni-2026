'use client'

import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  type Variants,
} from 'motion/react'
import CtaRouteButton from '@/components/cta-route-button'
import NavCard from '@/components/navigation/nav-card'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import { isSubNav, type NavItemType } from '@/types/components/nav-type'
import type { MobileNavProps } from '@/types/components/mobile-nav-type'
import type { BaseRouteType } from '@/types/objects/route-type'

/** Rise in sequence from the bottom, matching the reading order thumbs use. */
const container: Variants = {
  closed: {},
  open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}
const child: Variants = {
  closed: { opacity: 0, y: 12 },
  open: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const } },
}

/**
 * Full-height menu with content anchored to the bottom of the viewport, where
 * thumbs actually reach. Every destination is a card, and the primary action
 * sits lowest.
 */
export default function MobileNav({ data, closeMenu }: MobileNavProps) {
  const reduceMotion = useReducedMotion()
  const items = (data.items ?? []) as NavItemType[]
  if (!items.length) return null

  // The last plain route is treated as the primary action and pinned to the base.
  const routes = items.filter((i) => !isSubNav(i))
  const primary = routes.length ? (routes[routes.length - 1] as BaseRouteType) : null
  const rendered = primary ? items.filter((i) => i !== routes[routes.length - 1]) : items

  const Wrapper = reduceMotion ? 'div' : m.div
  const Item = reduceMotion ? 'div' : m.div
  const motionProps = reduceMotion
    ? {}
    : { variants: container, initial: 'closed', animate: 'open' }
  const itemProps = reduceMotion ? {} : { variants: child }

  const body = (
    <Wrapper
      {...motionProps}
      className="relative z-10 mt-auto flex w-full flex-col gap-2 pb-2"
    >
      {rendered.map((item, i) => {
        if (isSubNav(item)) {
          if (!item.items?.length) return null
          return (
            <Item key={item._key || `sub-${i}`} {...itemProps} className="flex flex-col gap-2">
              <span className="px-1 text-sm font-bold uppercase tracking-[0.12em] text-primary">
                {item.title}
              </span>
              {/* `display` is a desktop concern: it keeps a narrow panel for
                  short utility links. Mobile always uses cards so every
                  destination gets its description. */}
              <div className="flex flex-col gap-2">
                {item.items.map((link, j) => (
                  <NavCard
                    key={link._key || `link-${j}`}
                    item={link}
                    onNavigate={closeMenu}
                  />
                ))}
              </div>
            </Item>
          )
        }

        // A top-level route carries its own icon and blurb, so it reads as
        // one more card rather than a bare row between the groups.
        const route = item as BaseRouteType
        return (
          <Item key={item._key || `route-${i}`} {...itemProps}>
            <NavCard
              item={{ route, description: route.description, icon: route.icon }}
              onNavigate={closeMenu}
            />
          </Item>
        )
      })}

      {primary ? (
        <Item {...itemProps} className="pt-2">
          {/* Same shared Button as every other CTA, so the mark, the aurora and
              the hover behaviour cannot drift from the desktop nav. */}
          <CtaRouteButton
            route={primary}
            className="h-auto w-full py-2.5 text-lg font-bold"
            fallbackLabel="Get started"
          />
        </Item>
      ) : null}
    </Wrapper>
  )

  return (
    <div className="relative flex w-full flex-1 flex-col px-5 text-left">
      <TextureSectionBackdrop />
      {reduceMotion ? body : <LazyMotion features={domAnimation}>{body}</LazyMotion>}
    </div>
  )
}
