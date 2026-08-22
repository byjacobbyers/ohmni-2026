import { useEffect, useState } from 'react'
import { TranslateIcon } from '@sanity/icons/Translate'
import { useToast } from '@sanity/ui'
import { useClient, type DocumentActionComponent } from 'sanity'
import { useRouter } from 'sanity/router'
import { I18N_TYPES } from '../schemas/lib/language'
import { extractStrings, injectStrings, localizeDocument, localizedId } from '@/lib/translate'

const TYPES = new Set<string>(I18N_TYPES)

/**
 * "Translate to Spanish" on any English document, "Open Spanish version" once
 * it exists. The translation itself is a round trip to /api/translate; the
 * draft is created here with the editor's own Studio session, so the server
 * never needs a write token. Always a draft: a machine translation is a
 * starting point, and publishing it is a human decision.
 */
export const TranslateAction: DocumentActionComponent = (props) => {
  const { id, type, draft, published, onComplete } = props
  const client = useClient({ apiVersion: '2025-02-19' })
  const router = useRouter()
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const [twinExists, setTwinExists] = useState<boolean | null>(null)

  const doc = (draft ?? published) as Record<string, unknown> | null
  const language = (doc?.language as string | undefined) ?? 'en'
  const targetId = localizedId(id, 'es')

  useEffect(() => {
    if (!doc || language === 'es') return
    let cancelled = false
    client
      .fetch<number>('count(*[_id in [$id, $draft]])', { id: targetId, draft: `drafts.${targetId}` })
      .then((count) => !cancelled && setTwinExists(count > 0))
      .catch(() => !cancelled && setTwinExists(false))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, targetId, language, doc?._rev])

  if (!doc || !TYPES.has(type) || language === 'es') return null

  const open = () => {
    router.navigateIntent('edit', { id: targetId, type })
    onComplete()
  }

  const translate = async () => {
    setBusy(true)
    try {
      const strings = extractStrings(doc)
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strings, target: 'es' }),
      })
      if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`)
      const { translations } = (await res.json()) as { translations: Record<string, string> }

      // Repoint references at Spanish twins that already exist (forms, team).
      const refs = Array.from(JSON.stringify(doc).matchAll(/"_ref":"([^"]+)"/g), (m) => m[1])
      const candidates = [...new Set(refs)].map((r) => localizedId(r, 'es'))
      const existing = candidates.length
        ? await client.fetch<string[]>('*[_id in $ids]._id', { ids: candidates })
        : []

      const translated = injectStrings(doc, translations)
      const localized = localizeDocument(translated, 'es', new Set(existing))
      await client.create({ ...localized, _type: type, _id: `drafts.${localized._id}` })
      toast.push({ status: 'success', title: 'Spanish draft created', description: 'Review it, then publish.' })
      open()
    } catch (err) {
      toast.push({
        status: 'error',
        title: 'Translation failed',
        description: err instanceof Error ? err.message : String(err),
      })
    } finally {
      setBusy(false)
    }
  }

  if (twinExists) {
    return { label: 'Open Spanish version', icon: TranslateIcon, onHandle: open }
  }
  return {
    label: busy ? 'Translating…' : 'Translate to Spanish',
    icon: TranslateIcon,
    disabled: busy || twinExists === null,
    onHandle: translate,
  }
}
