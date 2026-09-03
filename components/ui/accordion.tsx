'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      className={cn('w-full', className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn('w-full border-b border-border', className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex w-full">
      <AccordionPrimitive.Trigger
        className={cn(
          'flex flex-1 cursor-pointer items-center justify-between gap-4 py-4 text-left text-h4 font-semibold transition-all [&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    // forceMount: collapsed answers must ship in the server HTML for SEO; Radix
    // otherwise unmounts them until first open. `block` overrides the UA
    // display:none from the `hidden` attribute Radix sets while closed. The
    // animated grid-rows collapse lives on the inner wrapper because Radix
    // zeroes transition durations inline on this node during measurement;
    // `invisible` keeps closed content out of the a11y tree and focus order.
    <AccordionPrimitive.Content forceMount className="group block" {...props}>
      <div className="invisible grid grid-rows-[0fr] [transition:grid-template-rows_200ms_ease-out,visibility_200ms] group-data-[state=open]:visible group-data-[state=open]:grid-rows-[1fr] motion-reduce:[transition:none]">
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              'pb-4 pt-0 text-left text-balance text-sm 2xl:text-2xl',
              className
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
