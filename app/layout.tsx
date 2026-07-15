import type { Metadata } from "next"
import { brand } from "@/lib/brand"

export const metadata: Metadata = {
  title: brand.name,
  description: brand.description,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}
