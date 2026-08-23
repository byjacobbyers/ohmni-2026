'use client'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import CtaRouteButton from '@/components/cta-route-button'
import NavCard from '@/components/navigation/nav-card'
import Route from '@/components/route'
import type { Locale } from '@/lib/i18n'
import { isSubNav, type NavItemType } from '@/types/components/nav-type'
import type { BaseRouteType } from '@/types/objects/route-type'

export type DesktopNavProps = {
  items?: NavItemType[]
  lang: Locale
  /** Header aurora hook, fired when the Book Now link is hovered. */
  onBookNowHoverChange?: (active: boolean) => void
  bookNowTitle?: string
}

const labelClass = 'font-bold uppercase'

/**
 * Grow on hover. Kept off the dropdown triggers: the label shifting under the
 * cursor fights the panel opening beneath it.
 */
const hoverGrow =
  'transition duration-200 ease-out hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100'

const linkClass = `${labelClass} ${hoverGrow}`

/** Sizing only. Colour, aurora and hover come from the shared Button. */
const primaryClass = `h-auto whitespace-nowrap px-4 py-2 ${labelClass} text-base xl:text-lg 2xl:text-2xl`

export default function DesktopNav({
  items,
  lang,
  onBookNowHoverChange,
  bookNowTitle = 'Book Now',
}: DesktopNavProps) {
  if (!items?.length) return null

  // Same rule the mobile menu uses: the last plain route is the primary
  // action, so both surfaces promote the same link without extra CMS config.
  const routes = items.filter((i) => !isSubNav(i))
  const primary = routes.length ? routes[routes.length - 1] : null

  return (
    <NavigationMenu
      // The shared viewport is one panel for the whole menu, so it can only sit
      // at one edge. Opting out lets each panel render inside its own item and
      // hang from that trigger's left edge.
      viewport={false}
      className="hidden lg:flex"
    >
      {/* Below xl the brand lockup and the solid CTA leave little room, so the
          labels step down a size and the gaps tighten. */}
      <NavigationMenuList className="items-center gap-4 text-base xl:gap-6 xl:text-lg 2xl:text-2xl">
        {items.map((item, i) => {
          if (isSubNav(item)) {
            if (!item.items?.length) return null
            return (
              <NavigationMenuItem key={item._key || `sub-${i}`}>
                {/* The shadcn trigger hard-codes text-sm, h-9 and a hover
                    background. Strip all three so a dropdown label reads
                    exactly like the plain routes beside it. */}
                <NavigationMenuTrigger
                  className={`${labelClass} h-auto bg-transparent p-0 text-base xl:text-lg 2xl:text-2xl hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent`}
                >
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-50 p-3">
                  <ul
                    className={
                      item.display === 'list'
                        ? 'grid w-[min(18rem,calc(100vw-3rem))] grid-cols-1 gap-2 xl:w-[min(20rem,calc(100vw-3rem))]'
                        : // A left-anchored panel has less room the further
                          // right its trigger sits, so it narrows below xl.
                          'grid w-[min(28rem,calc(100vw-3rem))] grid-cols-1 gap-3 sm:grid-cols-2 xl:w-[min(34rem,calc(100vw-3rem))]'
                    }
                  >
                    {item.items.map((link, j) => (
                      <li key={link._key || `link-${j}`}>
                        <NavigationMenuLink asChild>
                          <NavCard item={link} />
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )
          }

          const route = item as BaseRouteType
          const isBookNow = route.title === bookNowTitle

          if (item === primary) {
            return (
              <NavigationMenuItem key={item._key || `route-${i}`}>
                <CtaRouteButton route={route} className={primaryClass} />
              </NavigationMenuItem>
            )
          }

          return (
            <NavigationMenuItem key={item._key || `route-${i}`}>
              <Route
                data={route}
                className={linkClass}
                onMouseEnter={
                  isBookNow && onBookNowHoverChange
                    ? () => onBookNowHoverChange(true)
                    : undefined
                }
                onMouseLeave={
                  isBookNow && onBookNowHoverChange
                    ? () => onBookNowHoverChange(false)
                    : undefined
                }
              >
                {route.title || 'Link'}
              </Route>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
