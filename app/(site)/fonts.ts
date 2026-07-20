import { Inter } from "next/font/google";

// Token `--font-sans` (tokens/font.json → generated/tokens.css) names Inter.
// Here we load Inter so the layout class can point `--font-sans` at the webfont.
export const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

// Serif/mono stacks come from tokens (system ui-serif / ui-monospace).
export const serif = { variable: "" } as const;
export const mono = { variable: "" } as const;
