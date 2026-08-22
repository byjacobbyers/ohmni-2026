/**
 * Create the Spanish documents from export.mts output plus `<id>.es.json`
 * translations, and stamp `language: "en"` on the English originals.
 *
 *   SANITY_WRITE_TOKEN=… pnpm dlx tsx scripts/i18n/import.mts <dir> [--dry]
 *
 * Idempotent: createOrReplace on deterministic ids (`<id>--es`). References
 * are repointed to Spanish twins created in the same run, so forms and the
 * team bio land on Spanish pages without a second pass.
 */
import fs from 'node:fs'
import path from 'node:path'
import { injectStrings, localizeDocument, localizedId } from '../../lib/translate'

const dir = process.argv[2]
const dry = process.argv.includes('--dry')
if (!dir) throw new Error('usage: pnpm dlx tsx scripts/i18n/import.mts <dir> [--dry]')
const token = process.env.SANITY_WRITE_TOKEN
if (!token && !dry) throw new Error('SANITY_WRITE_TOKEN is required')

const sources = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.json') && !f.endsWith('.strings.json') && !f.endsWith('.es.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Record<string, unknown>)

const twins = new Set(sources.map((d) => localizedId(String(d._id), 'es')))
const mutations: unknown[] = []
for (const doc of sources) {
  const id = String(doc._id)
  const file = path.join(dir, `${id}.es.json`)
  if (!fs.existsSync(file)) {
    console.warn(`skip ${id}: no ${id}.es.json`)
    continue
  }
  const translations = JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, string>
  const bad = Object.values(translations).filter((v) => /[–—]/.test(v))
  if (bad.length) throw new Error(`${id}: ${bad.length} translations contain an em or en dash`)
  const es = localizeDocument(injectStrings(doc, translations), 'es', twins)
  mutations.push({ createOrReplace: es })
  mutations.push({ patch: { id, setIfMissing: { language: 'en' } } })
  console.log(`${String(doc._type).padEnd(16)} ${id} -> ${es._id} (${Object.keys(translations).length} strings)`)
}

if (dry) {
  fs.writeFileSync(path.join(dir, '_mutations.json'), JSON.stringify(mutations, null, 2))
  console.log(`dry run: ${mutations.length} mutations written to _mutations.json`)
} else {
  const res = await fetch('https://cekzwx7i.api.sanity.io/v2025-02-19/data/mutate/production?returnIds=true', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({ mutations }),
  })
  const body = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(body))
  console.log(`committed ${mutations.length} mutations, transaction ${body.transactionId}`)
}
