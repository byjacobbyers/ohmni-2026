'use client'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import NavCard from '@/components/navigation/nav-card'
import Route from '@/components/route'
import { isSubNav, type NavItemType } from '@/types/components/nav-type'
import type { BaseRouteType } from '@/types/objects/route-type'

export type DesktopNavProps = {
  items?: NavItemType[]
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

/** Solid blue call to action, matching the one pinned to the mobile menu. */
const primaryClass = `flex items-center bg-primary px-4 py-2 text-primary-foreground no-underline ${labelClass} ${hoverGrow}`

export default function DesktopNav({
  items,
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
      // The viewport wrapper ships as `left-0`, which runs off the right edge
      // for a nav anchored to the right of the header. The only div child of
      // the root is that wrapper, so realign it here rather than forking the
      // shadcn primitive.
      className="hidden lg:flex [&>div]:right-0 [&>div]:left-auto"
    >
      <NavigationMenuList className="items-center gap-6 text-lg 2xl:text-2xl">
        {items.map((item, i) => {
          if (isSubNav(item)) {
            if (!item.items?.length) return null
            return (
              <NavigationMenuItem key={item._key || `sub-${i}`}>
                {/* The shadcn trigger hard-codes text-sm, h-9 and a hover
                    background. Strip all three so a dropdown label reads
                    exactly like the plain routes beside it. */}
                <NavigationMenuTrigger
                  className={`${labelClass} h-auto bg-transparent p-0 text-lg 2xl:text-2xl hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent`}
                >
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-3">
                  <ul
                    className={
                      item.display === 'list'
                        ? 'grid w-[min(20rem,calc(100vw-3rem))] grid-cols-1 gap-2'
                        : 'grid w-[min(34rem,calc(100vw-3rem))] grid-cols-1 gap-3 sm:grid-cols-2'
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
          return (
            <NavigationMenuItem key={item._key || `route-${i}`}>
              <Route
                data={route}
                className={item === primary ? primaryClass : linkClass}
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
