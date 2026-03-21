'use client'

import { forwardRef } from 'react'
import Link from 'next/link'
import { BaseRouteType } from '@/types/objects/route-type'
import { buildRouteProps } from '@/lib/route-resolver'
import { ReactNode, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'
import { useCtaLocation } from '@/context'

interface RouteProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  data: BaseRouteType
  children: ReactNode
  className?: string
}

const Route = forwardRef<HTMLAnchorElement, RouteProps>(
  ({ data, children, className, ...rest }, ref) => {
    const ctaLocation = useCtaLocation()
    if (!data || !data.linkType) {
      return <>{children}</>
    }

    const { onClick: onClickFromRest, ...restWithoutOnClick } = rest
    const routeProps = buildRouteProps(data, {
      ctaLocation: ctaLocation || undefined,
    })
    const { onClick: routeOnClick, ...routePropsWithoutOnClick } = routeProps
    const mergedOnClick =
      routeOnClick || onClickFromRest
        ? (e: MouseEvent<HTMLAnchorElement>) => {
            routeOnClick?.(e)
            onClickFromRest?.(e)
          }
        : undefined
    const isExternal =
      data.linkType === 'external' ||
      data.linkType === 'email' ||
      data.linkType === 'telephone'
    const isFileDownload = data.linkType === 'file'
    const isAnchor = data.linkType === 'anchor'

    const dataAttrs = Object.fromEntries(
      (data.dataAttributes ?? [])
        .filter((d) => d?.key)
        .map(({ key, value }) => [`data-${key}`, value ?? ''] as const),
    )

    const mergedClassName = cn(className)

    if (isExternal || isFileDownload || data.blank) {
      return (
        <a
          ref={ref}
          {...routePropsWithoutOnClick}
          {...dataAttrs}
          {...restWithoutOnClick}
          onClick={mergedOnClick}
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
          {...routePropsWithoutOnClick}
          {...dataAttrs}
          {...restWithoutOnClick}
          onClick={mergedOnClick}
          className={mergedClassName}
        >
          {children}
        </a>
      )
    }

    return (
      <Link
        ref={ref}
        {...routePropsWithoutOnClick}
        {...dataAttrs}
        {...restWithoutOnClick}
        onClick={mergedOnClick}
        className={mergedClassName}
      >
        {children}
      </Link>
    )
  }
)

Route.displayName = 'Route'

export default Route
