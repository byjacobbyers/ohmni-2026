/**
 * Dump every English document that has a Spanish counterpart type, plus the
 * list of strings to translate, one pair of files per document.
 *
 *   pnpm dlx tsx scripts/i18n/export.mts <outDir>
 *
 * Translate `<id>.strings.json` into `<id>.es.json` ({ path: text }), then run
 * import.ts. Published documents only; the dataset is public so no token.
 */
import fs from 'node:fs'
import path from 'node:path'
import { extractStrings } from '../../lib/translate'

const outDir = process.argv[2]
if (!outDir) throw new Error('usage: pnpm dlx tsx scripts/i18n/export.mts <outDir>')
fs.mkdirSync(outDir, { recursive: true })

const projectId = 'cekzwx7i'
const TYPES = ['team', 'form', 'formSettings', 'postCtaSettings', 'navigation', 'announcement', 'page', 'post']
const query = `*[_type in $types && coalesce(language, "en") == "en" && !(_id in path("drafts.**")) && seo.noIndex != true]`
const url = `https://${projectId}.api.sanity.io/v2025-02-19/data/query/production?query=${encodeURIComponent(query)}&$types=${encodeURIComponent(JSON.stringify(TYPES))}`
const { result } = (await (await fetch(url)).json()) as { result: Array<Record<string, unknown>> }

let total = 0
for (const doc of result) {
  const strings = extractStrings(doc)
  total += strings.reduce((n, s) => n + s.text.length, 0)
  fs.writeFileSync(path.join(outDir, `${doc._id}.json`), JSON.stringify(doc, null, 2))
  fs.writeFileSync(path.join(outDir, `${doc._id}.strings.json`), JSON.stringify(strings, null, 2))
  console.log(`${String(doc._type).padEnd(16)} ${String(doc._id).padEnd(44)} ${String(strings.length).padStart(4)} strings`)
}
console.log(`${result.length} documents, ~${total.toLocaleString()} characters`)
