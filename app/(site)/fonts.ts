import { Merriweather_Sans, Merriweather, JetBrains_Mono } from "next/font/google";

export const sans = Merriweather_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: "--font-sans",
  weight: ['300', '400', '500', '600', '700'],
});

export const serif = Merriweather({
  subsets: ['latin'],
  display: 'swap',
  variable: "--font-serif",
  weight: ['300', '400', '700'],
});

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: "--font-mono",
  weight: ['400', '500', '600', '700'],
});
