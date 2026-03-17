import { buildRouteProps } from '@/lib/route-resolver'
import type { BaseRouteType } from '@/types/objects/route-type'
import SanityImage from '@/components/sanity-image'

type LinkWithRouteValue = {
  _type?: string
  route?: BaseRouteType
}

export const portableTextComponents = {
  block: {
    small: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-sm">{children}</p>
    ),
  },
  types: {
    defaultImage: ({
      value,
    }: {
      value?: { asset?: unknown; alt?: string; crop?: unknown; hotspot?: unknown }
    }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-4 relative aspect-video w-full max-w-2xl mx-auto">
          <SanityImage
            image={value}
            alt={value.alt || ''}
            className="rounded-lg object-cover"
          />
          {value.alt ? (
            <figcaption className="mt-2 text-sm text-muted-foreground text-center">
              {value.alt}
            </figcaption>
          ) : null}
        </figure>
      )
    },
  },
  marks: {
    linkWithRoute: ({
      value,
      children,
    }: {
      value?: LinkWithRouteValue
      children?: React.ReactNode
    }) => {
      if (!value?.route) return <>{children}</>
      const props = buildRouteProps(value.route)
      return (
        <a
          {...props}
          className="text-primary underline underline-offset-2 hover:opacity-90"
        >
          {children}
        </a>
      )
    },
  },
}
