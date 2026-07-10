import type { ComponentProps, ReactNode } from 'react'
import type { BaseRouteType } from '@/types/objects/route-type'

export type RouteProps = ComponentProps<'a'> & {
  data: BaseRouteType
  children: ReactNode
  className?: string
}
