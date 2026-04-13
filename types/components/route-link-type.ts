import type { AnchorHTMLAttributes, ReactNode } from 'react'
import type { BaseRouteType } from '@/types/objects/route-type'

export type RouteProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  data: BaseRouteType
  children: ReactNode
  className?: string
}
