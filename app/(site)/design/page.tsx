import { ScaleRows } from './scale-rows'

const COLOR_TOKENS = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
] as const

const SIDEBAR_COLOR_TOKENS = [
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
] as const

const SHADOW_TOKENS = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const

const SPACE_TOKENS = ['1', '2', '3', '4', '6', '8', '10', '12'] as const

type ColorTokenName =
  | (typeof COLOR_TOKENS)[number]
  | (typeof SIDEBAR_COLOR_TOKENS)[number]

function ColorSwatch({ name }: { name: ColorTokenName }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 w-full border border-border"
        style={{ backgroundColor: `var(--${name})` }}
        title={name}
      />
      <div className="font-mono text-xs text-muted-foreground">--{name}</div>
      <div className="dark overflow-hidden border border-border">
        <div
          className="h-8 w-full"
          style={{ backgroundColor: `var(--${name})` }}
          title={`${name} (dark)`}
        />
      </div>
      <div className="font-mono text-[10px] text-muted-foreground">dark</div>
    </div>
  )
}

export default function DesignPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-h2 font-bold">Design reference</h1>
      <p className="mb-10 max-w-2xl text-body text-muted-foreground">
        Noindex style guide. Theme originated on{' '}
        <a
          href="https://tweakcn.com/"
          className="text-primary underline-offset-4 hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          tweakcn
        </a>
        ; canonical store is <code className="font-mono text-sm">tokens/</code> →{' '}
        <code className="font-mono text-sm">app/(site)/generated/tokens.css</code>. Edit JSON, run{' '}
        <code className="font-mono text-sm">pnpm tokens:build</code>, review here.
      </p>

      <section id="colors" className="scroll-mt-20 border-t border-border pt-10">
        <h2 className="mb-2 text-h3 font-semibold">Colors</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Semantic light swatches; nested bar shows the dark-mode value.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {COLOR_TOKENS.map((name) => (
            <ColorSwatch key={name} name={name} />
          ))}
        </div>

        <h3 className="mt-12 mb-2 text-xl font-semibold">Sidebar</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          shadcn sidebar tokens (also from the tweakcn export).
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {SIDEBAR_COLOR_TOKENS.map((name) => (
            <ColorSwatch key={name} name={name} />
          ))}
        </div>
      </section>

      <section id="fonts" className="mt-16 scroll-mt-20 border-t border-border pt-10">
        <h2 className="mb-2 text-h3 font-semibold">Fonts</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Stacks from tokens. Inter is loaded in <code className="font-mono text-xs">fonts.ts</code>.
        </p>
        <div className="flex flex-col gap-8">
          <div>
            <div className="mb-2 font-mono text-xs text-muted-foreground">--font-sans / font-sans</div>
            <p className="font-sans text-h3">The quick brown fox jumps over the lazy dog</p>
          </div>
          <div>
            <div className="mb-2 font-mono text-xs text-muted-foreground">--font-serif / font-serif</div>
            <p className="font-serif text-h3">The quick brown fox jumps over the lazy dog</p>
          </div>
          <div>
            <div className="mb-2 font-mono text-xs text-muted-foreground">--font-mono / font-mono</div>
            <p className="font-mono text-h4">The quick brown fox jumps over the lazy dog</p>
          </div>
        </div>
      </section>

      <section id="type" className="mt-16 scroll-mt-20 border-t border-border pt-10">
        <h2 className="mb-2 text-h3 font-semibold">Type scale</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Live computed sizes for <code className="font-mono text-xs">text-*</code> utilities.
        </p>
        <ScaleRows />

        <div className="mt-12 border-t border-border pt-10">
          <h3 className="mb-2 text-xl font-semibold">Example copy</h3>
          <p className="mb-8 text-sm text-muted-foreground">
            Portable-text-shaped sample using only the <code className="font-mono text-xs">content</code>{' '}
            wrapper.
          </p>
          <div className="content">
            <h1 className="display">Marketing Moves Fast. Your Website Should Too.</h1>
            <p className="lead">
              High-performance websites that help B2B marketing teams launch campaigns without technical
              bottlenecks.
            </p>
            <h2>When the Website Becomes the Bottleneck</h2>
            <p>Marketing teams rely on their website to launch campaigns and publish content.</p>
            <ul>
              <li>Landing pages take longer to launch.</li>
              <li>Simple updates require developer time.</li>
            </ul>
            <blockquote>
              The website should never slow marketing down. That&apos;s the principle we design around.
            </blockquote>
            <p>
              Use <code>text-display</code> for heroes and <mark>highlight</mark> for emphasis.
            </p>
          </div>
        </div>
      </section>

      <section id="space" className="mt-16 scroll-mt-20 border-t border-border pt-10">
        <h2 className="mb-2 text-h3 font-semibold">Spacing &amp; radius</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          <code className="font-mono text-xs">--space-*</code>, base{' '}
          <code className="font-mono text-xs">--spacing</code>, and{' '}
          <code className="font-mono text-xs">--radius</code>.
        </p>
        <div className="flex flex-col gap-4">
          {SPACE_TOKENS.map((key) => (
            <div key={key} className="flex items-center gap-4">
              <span className="w-24 shrink-0 font-mono text-xs text-muted-foreground">
                --space-{key}
              </span>
              <div className="h-4 bg-primary" style={{ width: `var(--space-${key})` }} />
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-4">
          <span className="w-36 shrink-0 font-mono text-xs text-muted-foreground">--spacing</span>
          <div className="h-4 bg-muted-foreground/40" style={{ width: 'var(--spacing)' }} />
          <span className="font-mono text-xs text-muted-foreground">tweakcn base spacing unit</span>
        </div>
        <div className="mt-10 flex items-center gap-4">
          <span className="w-36 shrink-0 font-mono text-xs text-muted-foreground">--radius</span>
          <div
            className="size-16 border-2 border-primary bg-muted"
            style={{ borderRadius: 'var(--radius)' }}
          />
          <span className="text-sm text-muted-foreground">
            Currently 0 (sharp corners). Change in{' '}
            <code className="font-mono text-xs">tokens/radius.json</code>.
          </span>
        </div>
      </section>

      <section id="shadows" className="mt-16 scroll-mt-20 border-t border-border pt-10">
        <h2 className="mb-2 text-h3 font-semibold">Shadows</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Elevation scale from <code className="font-mono text-xs">tokens/shadow.json</code>.
        </p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {SHADOW_TOKENS.map((key) => (
            <div key={key} className="flex flex-col gap-2">
              <div
                className="flex h-20 items-center justify-center border border-border bg-background"
                style={{ boxShadow: `var(--shadow-${key})` }}
              >
                <span className="font-mono text-xs text-muted-foreground">{key}</span>
              </div>
              <div className="font-mono text-xs text-muted-foreground">--shadow-{key}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="tracking" className="mt-16 scroll-mt-20 border-t border-border pt-10 pb-16">
        <h2 className="mb-2 text-h3 font-semibold">Tracking</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Base letter-spacing from the tweakcn export (
          <code className="font-mono text-xs">--tracking-normal</code>). Type-scale tracking lives on
          each <code className="font-mono text-xs">--type-*</code> token.
        </p>
        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-2 font-mono text-xs text-muted-foreground">--tracking-normal</div>
            <p className="text-h3" style={{ letterSpacing: 'var(--tracking-normal)' }}>
              Marketing Moves Fast
            </p>
          </div>
          <div>
            <div className="mb-2 font-mono text-xs text-muted-foreground">
              --type-display-letter-spacing (display)
            </div>
            <p className="text-display">Ohmni</p>
          </div>
        </div>
      </section>
    </main>
  )
}
