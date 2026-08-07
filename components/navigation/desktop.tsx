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

const linkClass =
  'font-bold uppercase transition duration-200 ease-out hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100'

export default function DesktopNav({
  items,
  onBookNowHoverChange,
  bookNowTitle = 'Book Now',
}: DesktopNavProps) {
  if (!items?.length) return null

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
                <NavigationMenuTrigger className={`${linkClass} bg-transparent p-0`}>
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
