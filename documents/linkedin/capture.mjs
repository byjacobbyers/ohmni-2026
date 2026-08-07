/**
 * Render documents/linkedin/cover.html to a LinkedIn banner PNG.
 *
 * LinkedIn wants 1584x396 (4:1). Rendered at 2x so it stays crisp on retina.
 * Usage: node documents/linkedin/capture.mjs
 */
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

const DIR = path.join(process.cwd(), 'documents', 'linkedin')
const SOURCE = path.join(DIR, 'cover.html')
const OUT = path.join(DIR, 'ohmni-linkedin-cover.png')

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1584, height: 396 },
  deviceScaleFactor: 2,
})
await page.goto(pathToFileURL(SOURCE).href, { waitUntil: 'networkidle' })
// The Inter variable font is installed system-wide; give it a beat to swap in.
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: OUT })
await browser.close()

console.log(`Wrote ${OUT} (3168x792, 4:1)`)
