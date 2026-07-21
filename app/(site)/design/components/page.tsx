'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'

function GallerySection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="scroll-mt-20 border-t border-border py-10">
      <h2 className="mb-6 font-mono text-sm font-medium text-muted-foreground">{title}</h2>
      {children}
    </section>
  )
}

function VariantLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block font-mono text-xs text-muted-foreground">{children}</span>
}

export default function DesignComponentsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 pb-20">
      <h1 className="mb-2 text-h2 font-bold">Components</h1>
      <p className="mb-10 max-w-2xl text-body text-muted-foreground">
        Live UI primitives from <code className="font-mono text-sm">components/ui/</code>. Page-builder
        blocks live under <code className="font-mono text-sm">/design/sections</code>.
      </p>

      <GallerySection title="Button">
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <VariantLabel>default</VariantLabel>
            <Button variant="default">Primary</Button>
          </div>
          <div>
            <VariantLabel>secondary</VariantLabel>
            <Button variant="secondary">Secondary</Button>
          </div>
          <div>
            <VariantLabel>outline</VariantLabel>
            <Button variant="outline">Outline</Button>
          </div>
          <div>
            <VariantLabel>link</VariantLabel>
            <Button variant="link">Link</Button>
          </div>
          <div>
            <VariantLabel>huge</VariantLabel>
            <Button variant="huge">Huge CTA</Button>
          </div>
          <div>
            <VariantLabel>sm</VariantLabel>
            <Button size="sm">Small</Button>
          </div>
        </div>
      </GallerySection>

      <GallerySection title="Card">
        <div className="grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <VariantLabel>default (border + bg-card)</VariantLabel>
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Card title</CardTitle>
                <CardDescription>Supporting description.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-body">Body content inside the card.</p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm">
                  Action
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div>
            <VariantLabel>cards block (muted / borderless)</VariantLabel>
            <Card className="max-w-md items-center justify-center border-0 bg-muted/40 py-6 md:py-8">
              <CardContent className="w-full px-3 text-center text-balance sm:px-6">
                <div className="content">
                  <h3>Logo-style card</h3>
                  <p>Same muted surface the Cards section uses.</p>
                </div>
              </CardContent>
              <CardFooter className="w-full justify-center px-3 pb-3 pt-2 sm:px-6">
                <Button variant="secondary" size="sm">
                  Learn more
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </GallerySection>

      <GallerySection title="Input / Label / Textarea">
        <div className="flex max-w-md flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="design-email">Email</Label>
            <Input id="design-email" type="email" placeholder="you@company.com" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="design-message">Message</Label>
            <Textarea id="design-message" placeholder="Tell us a bit about the project…" />
          </div>
        </div>
      </GallerySection>

      <GallerySection title="ImagePlaceholder">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <VariantLabel>video · 16∶9</VariantLabel>
            <ImagePlaceholder aspect="video" caption="Default media slot" />
          </div>
          <div>
            <VariantLabel>square</VariantLabel>
            <ImagePlaceholder aspect="square" caption="1∶1 crop" />
          </div>
          <div>
            <VariantLabel>portrait · 3∶4</VariantLabel>
            <ImagePlaceholder aspect="portrait" caption="Portrait media" />
          </div>
          <div>
            <VariantLabel>wide · 21∶9</VariantLabel>
            <ImagePlaceholder aspect="wide" caption="Cinematic / cover" />
          </div>
        </div>
      </GallerySection>

      <GallerySection title="Accordion">
        <Accordion type="single" collapsible defaultValue="one">
          <AccordionItem value="one">
            <AccordionTrigger>First item</AccordionTrigger>
            <AccordionContent>
              Expanded content for the first accordion item — same scale as Input.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="two">
            <AccordionTrigger>Second item</AccordionTrigger>
            <AccordionContent>
              Expanded content for the second accordion item.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </GallerySection>

      <GallerySection title="Avatar">
        <div className="flex items-center gap-4">
          <div>
            <VariantLabel>fallback</VariantLabel>
            <Avatar>
              <AvatarFallback>OH</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <VariantLabel>fallback (alt)</VariantLabel>
            <Avatar>
              <AvatarFallback>BY</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </GallerySection>

      <GallerySection title="Tooltip">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </GallerySection>
    </main>
  )
}
