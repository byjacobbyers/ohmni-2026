'use client'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import Route from '@/components/route'
import { BaseRouteType } from '@/types/objects/route-type'

interface MobileNavProps {
  data: { items?: BaseRouteType[] }
  closeMenu: () => void
}

export default function MobileNav({ data, closeMenu }: MobileNavProps) {
  const handleItemClick = () => {
    closeMenu()
  }

  return (
    <NavigationMenu viewport={false} className="w-full max-w-none">
      <NavigationMenuList className="flex w-full flex-col gap-y-5 p-0">
        {data.items?.map((item, index) => (
          <NavigationMenuItem
            key={'header' + index}
            id={'header' + index}
            className="w-full"
            onClick={handleItemClick}
          >
            <Route
              data={item}
              className="flex w-full justify-center text-2xl"
            >
              {item.title || 'Needs title'}
            </Route>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
