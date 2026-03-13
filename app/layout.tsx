import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Wiggelrhum",
  description: "Wiggelrhum",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}
