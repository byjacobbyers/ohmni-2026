'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { PrimaryButtonAuroraLayers } from '@/components/ui/primary-button-aurora-layers'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg 2xl:text-2xl font-medium transition duration-200 ease-out hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground shadow',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline hover:!scale-100',
        huge:
          'text-primary-foreground shadow whitespace-normal text-center !h-auto min-h-0 !px-8 !py-4 !text-h4',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function isPrimaryAuroraVariant(variant: VariantProps<typeof buttonVariants>['variant']) {
  return variant === 'default' || variant === 'huge'
}

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean
    }
>(({ className, variant, size, asChild = false, children, onMouseEnter, ...props }, ref) => {
  const resolvedVariant = variant ?? 'default'
  const primaryAurora = isPrimaryAuroraVariant(resolvedVariant)
  const [mountAurora, setMountAurora] = React.useState(false)

  const handleMouseEnter = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setMountAurora(true)
      onMouseEnter?.(e)
    },
    [onMouseEnter]
  )

  if (!primaryAurora) {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
        onMouseEnter={onMouseEnter}
      >
        {children}
      </Comp>
    )
  }

  const mergedClassName = cn(
    buttonVariants({ variant, size, className }),
    'group relative isolate overflow-hidden'
  )

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<{
      children?: React.ReactNode
      className?: string
      onMouseEnter?: React.MouseEventHandler<HTMLElement>
    }>

    const prevOnEnter = child.props.onMouseEnter
    const mergedOnEnter = (e: React.MouseEvent<HTMLElement>) => {
      setMountAurora(true)
      prevOnEnter?.(e)
    }

    return (
      <Slot ref={ref} className={mergedClassName} {...props}>
        {React.cloneElement(child, {
          onMouseEnter: mergedOnEnter,
          children: (
            <PrimaryButtonAuroraLayers mountAurora={mountAurora}>
              {child.props.children}
            </PrimaryButtonAuroraLayers>
          ),
        })}
      </Slot>
    )
  }

  return (
    <button
      ref={ref}
      className={mergedClassName}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      <PrimaryButtonAuroraLayers mountAurora={mountAurora}>{children}</PrimaryButtonAuroraLayers>
    </button>
  )
})

Button.displayName = 'Button'

export { Button, buttonVariants }
