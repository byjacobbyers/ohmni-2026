import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

type FontSizeConfig = {
  fontSize: string
  lineHeight?: string
  letterSpacing?: string
  fontWeight?: string | number
}

const TYPE_SCALE: Record<string, FontSizeConfig> = {
  display: {
    fontSize: "4rem",
    lineHeight: "1.05",
    letterSpacing: "-0.03em",
    fontWeight: 700,
  },
  h1: {
    fontSize: "3rem",
    lineHeight: "1.1",
    letterSpacing: "-0.025em",
    fontWeight: 700,
  },
  h2: {
    fontSize: "2.25rem",
    lineHeight: "1.15",
    letterSpacing: "-0.02em",
    fontWeight: 700,
  },
  h3: {
    fontSize: "1.75rem",
    lineHeight: "1.2",
    letterSpacing: "-0.015em",
    fontWeight: 600,
  },
  "body-lg": {
    fontSize: "1.125rem",
    lineHeight: "1.65",
    fontWeight: 400,
  },
  body: {
    fontSize: "1rem",
    lineHeight: "1.7",
    fontWeight: 400,
  },
  small: {
    fontSize: "0.875rem",
    lineHeight: "1.6",
    fontWeight: 400,
  },
}

const ORDERED_KEYS = ["display", "h1", "h2", "h3", "body-lg", "body", "small"] as const

export default function TypeScalePage() {
  const sample = "How vexingly quick daft zebras jump"

  return (
    <main className="px-4 py-8 max-w-5xl mx-auto">
      <h1 className="font-bold text-4xl mb-6">Tailwind Type Scale</h1>
      <p className="mb-8">
        This page is intentionally not crawlable. It shows the type scale behind utilities like{" "}
        <code>text-display</code>, <code>text-h1</code>, and <code>text-body</code>, matching the values defined in
        your <code>@theme</code> configuration in <code>globals.css</code>.
      </p>

      <div className="flex flex-col gap-6">
        {ORDERED_KEYS.map((key) => {
          const config = TYPE_SCALE[key]
          const metaParts: string[] = [
            `size: ${config.fontSize}`,
            config.lineHeight ? `lineHeight: ${config.lineHeight}` : "",
            config.letterSpacing ? `letterSpacing: ${config.letterSpacing}` : "",
            config.fontWeight !== undefined ? `fontWeight: ${String(config.fontWeight)}` : "",
          ].filter(Boolean)

          return (
            <section key={key} className="border rounded-lg p-4">
              <div className="flex flex-col gap-2 mb-3">
                <div className="text-xs opacity-80">
                  <span className="font-mono">{`text-${key}`}</span>
                </div>
                <div
                  className="font-sans"
                  style={{
                    fontSize: config.fontSize,
                    lineHeight: config.lineHeight,
                    letterSpacing: config.letterSpacing,
                    fontWeight: config.fontWeight,
                  }}
                >
                  {sample}
                </div>
              </div>

              <div className="text-sm opacity-80 font-mono">{metaParts.join(" | ")}</div>
            </section>
          )
        })}
      </div>
    </main>
  )
}

