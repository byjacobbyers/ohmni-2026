'use client'

import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import Route from '@/components/route'
import { BaseRouteType } from '@/types/objects/route-type'

const BOOK_NOW_TITLE = 'Book Now'

interface MobileNavProps {
  data: { items?: BaseRouteType[] }
  closeMenu: () => void
  /** Fires when Book Now link is hovered (e.g. header aurora on tablet with pointer). */
  onBookNowHoverChange?: (active: boolean) => void
}

export default function MobileNav({
  data,
  closeMenu,
  onBookNowHoverChange,
}: MobileNavProps) {
  const handleItemClick = () => {
    closeMenu()
  }

  return (
    <NavigationMenu viewport={false} className="w-full max-w-none">
      <NavigationMenuList className="flex w-full flex-col gap-y-5 p-0">
        {data.items?.map((item, index) => {
          const isBookNow = item.title === BOOK_NOW_TITLE
          return (
            <NavigationMenuItem
              key={'header' + index + 1}
              id={'header' + index + 1}
              className="w-full"
              onClick={handleItemClick}
            >
              <Route
                data={item}
                className="flex w-full justify-center text-3xl font-bold"
                onMouseEnter={
                  isBookNow && onBookNowHoverChange
                    ? () => {
                        onBookNowHoverChange(true)
                      }
                    : undefined
                }
                onMouseLeave={
                  isBookNow && onBookNowHoverChange
                    ? () => onBookNowHoverChange(false)
                    : undefined
                }
              >
                {item.title || 'Needs title'}
              </Route>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
