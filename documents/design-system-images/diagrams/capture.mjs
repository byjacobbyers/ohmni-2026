/**
 * Render each .diagram in source.html to its own PNG at 2x.
 * Usage: node documents/design-system-images/diagrams/capture.mjs
 */
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

const DIR = path.join(process.cwd(), 'documents', 'design-system-images', 'diagrams')
const IDS = ['seams', 'sixbuttons', 'response', 'twopaths', 'uncounted', 'onecause', 'totals', 'start', 'mailroom', 'dgstack']

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 2 })
await page.goto(pathToFileURL(path.join(DIR, 'source.html')).href, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)

for (const id of IDS) {
  const el = page.locator(`#${id}`)
  const out = path.join(DIR, `${id}.png`)
  await el.screenshot({ path: out })
  const box = await el.boundingBox()
  console.log(`${id}.png  ${Math.round(box.width)}x${Math.round(box.height)}`)
}
await browser.close()
