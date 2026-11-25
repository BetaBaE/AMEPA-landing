import { randomUUID } from 'node:crypto'
import { appendFile, mkdir } from 'node:fs/promises'
import { FORM_TYPES, validate } from '@/lib/forms'
import { writeClient } from '@/sanity/lib/client'

// Limite par adresse IP, propre à chaque instance : freine les abus simples.
const WINDOW = 10 * 60 * 1000
const MAX = 5
const hits = new Map()

function limited(ip) {
  const now = Date.now()
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((h) => now - h >= WINDOW)) hits.delete(k)
  const recent = (hits.get(ip) ?? []).filter((h) => now - h < WINDOW)
  if (recent.length >= MAX) return true
  hits.set(ip, [...recent, now])
  return false
}

const json = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

async function saveToSanity(doc) {
  const client = writeClient()
  if (!client) return false
  await client.create({ _id: `submissions.${randomUUID()}`, _type: 'submission', status: 'Nouveau', ...doc })
  return true
}

async function sendEmail(doc) {
  const { RESEND_API_KEY, FORMS_FROM_EMAIL, FORMS_TO_EMAIL } = process.env
  if (!RESEND_API_KEY || !FORMS_FROM_EMAIL || !FORMS_TO_EMAIL) return false
  const oneLine = (s) => s.replace(/[\r\n]+/g, ' ')
  const lines = Object.entries(doc).filter(([, v]) => v).map(([k, v]) => `${k} : ${v}`)
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FORMS_FROM_EMAIL, to: FORMS_TO_EMAIL.split(',').map((s) => s.trim()), reply_to: doc.email,
      subject: oneLine(`[Site AMEPA] ${doc.formType} : ${doc.name || doc.email}`).slice(0, 180), text: lines.join('\n'),
    }),
  })
  if (!res.ok) throw new Error(`Resend ${res.status}`)
  return true
}

export async function POST(request) {
  let body
  try {
    const raw = await request.text()
    if (raw.length > 20000) return json({ error: 'too-large' }, 413)
    body = JSON.parse(raw)
  } catch {
    return json({ error: 'bad-request' }, 400)
  }
  if (!body || typeof body !== 'object' || !FORM_TYPES.includes(body.formType)) return json({ error: 'bad-request' }, 400)

  // Robot probable : on répond « ok » sans rien enregistrer.
  if (body.website || !(Number(body.elapsed) > 1500)) return json({ ok: true })

  const { values, errors } = validate(body.formType, body)
  if (Object.keys(errors).length) return json({ errors }, 422)

  const ip = (request.headers.get('x-forwarded-for') ?? 'local').split(',')[0].trim()
  if (limited(ip)) return json({ error: 'rate-limited' }, 429)

  const doc = { formType: body.formType, ...values, locale: ['fr', 'ar', 'en'].includes(body.locale) ? body.locale : 'fr', createdAt: new Date().toISOString() }
  const results = await Promise.allSettled([saveToSanity(doc), sendEmail(doc)])
  for (const r of results) if (r.status === 'rejected') console.error('[forms]', r.reason?.message)
  if (results.some((r) => r.status === 'fulfilled' && r.value)) return json({ ok: true })

  // En local, sans Sanity ni Resend, la demande est gardée dans .data/ pour pouvoir tester.
  // Si l'un des deux est configuré mais échoue, l'erreur est montrée.
  if (process.env.NODE_ENV === 'development' && results.every((r) => r.status === 'fulfilled')) {
    await mkdir('.data', { recursive: true })
    await appendFile('.data/submissions.ndjson', `${JSON.stringify(doc)}\n`)
    return json({ ok: true })
  }
  console.error('[forms] aucune destination disponible : configurer SANITY_API_WRITE_TOKEN ou RESEND_API_KEY')
  return json({ error: 'unavailable' }, 503)
}
