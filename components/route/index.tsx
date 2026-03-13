'use client'

import { forwardRef } from 'react'
import Link from 'next/link'
import { BaseRouteType } from '@/types/objects/route-type'
import { buildRouteProps } from '@/lib/route-resolver'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface RouteProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  data: BaseRouteType
  children: ReactNode
  className?: string
}

const Route = forwardRef<HTMLAnchorElement, RouteProps>(
  ({ data, children, className, ...rest }, ref) => {
    if (!data || !data.linkType) {
      return <>{children}</>
    }

    const routeProps = buildRouteProps(data)
    const isExternal =
      data.linkType === 'external' ||
      data.linkType === 'email' ||
      data.linkType === 'telephone'
    const isFileDownload = data.linkType === 'file'
    const isAnchor = data.linkType === 'anchor'

    const mergedClassName = cn(className)

    if (isExternal || isFileDownload || data.blank) {
      return (
        <a
          ref={ref}
          {...routeProps}
          {...rest}
          className={mergedClassName}
        >
          {children}
        </a>
      )
    }

    if (isAnchor) {
      return (
        <a
          ref={ref}
          {...routeProps}
          {...rest}
          className={mergedClassName}
        >
          {children}
        </a>
      )
    }

    return (
      <Link ref={ref} {...routeProps} {...rest} className={mergedClassName}>
        {children}
      </Link>
    )
  }
)

Route.displayName = 'Route'

export default Route
