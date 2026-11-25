// Génère le contenu de départ pour Sanity : npm run seed  →  .data/seed.ndjson
// Import : npm run seed:import
import { mkdirSync, writeFileSync } from 'node:fs'
import ar from '../src/content/ar.js'
import en from '../src/content/en.js'
import fr from '../src/content/fr.js'
import { governance, members } from '../src/content/shared.js'

const LOCALES = { fr, ar, en }
const docs = []
const slug = (current) => ({ _type: 'slug', current })
const keyed = (list) => list?.map((d, i) => (typeof d === 'object' ? { _key: d._key ?? `k${i}`, ...d } : d))
const refs = (list, locale) => (list ?? []).map((s) => ({ _key: s, _type: 'reference', _ref: `domain-${s}-${locale}` }))

// Relie les trois versions d'un document pour le sélecteur de langue du Studio.
const link = (type, key) => docs.push({
  _id: `translation-${type}-${key}`, _type: 'translation.metadata', schemaTypes: [type],
  translations: Object.keys(LOCALES).map((language) => ({
    _key: language, _type: 'internationalizedArrayReferenceValue', language,
    value: { _type: 'reference', _weak: true, _ref: key ? `${type}-${key}-${language}` : `${type}-${language}` },
  })),
})

for (const [language, c] of Object.entries(LOCALES)) {
  const { keyFigures, ...settings } = c.settings
  docs.push({ _id: `siteSettings-${language}`, _type: 'siteSettings', language, ...settings, keyFigures: keyed(keyFigures) })
  for (const { slug: s, ...d } of c.domains) docs.push({ _id: `domain-${s}-${language}`, _type: 'domain', language, slug: slug(s), ...d })
  for (const { slug: s, domains, ...d } of c.events) {
    // startDate est obligatoire dans le Studio : une date provisoire est masquée par « Date à confirmer ».
    docs.push({ _id: `event-${s}-${language}`, _type: 'event', language, slug: slug(s), ...d, ...(d.startDate ? {} : { startDate: '2027-01-01T09:00:00Z' }), domains: refs(domains, language) })
  }
  for (const { slug: s, ...d } of c.posts) docs.push({ _id: `post-${s}-${language}`, _type: 'post', language, slug: slug(s), ...d })
  for (const { key, domains, ...d } of c.publications) docs.push({ _id: `publication-${key}-${language}`, _type: 'publication', language, ...d, domains: refs(domains, language) })
  for (const [s, d] of Object.entries(c.pages)) docs.push({ _id: `page-${s}-${language}`, _type: 'page', language, slug: slug(s), ...d })
}
for (const { key, ...d } of members) docs.push({ _id: `member-${key}`, _type: 'member', ...d })
for (const { key, ...d } of governance) docs.push({ _id: `governance-${key}`, _type: 'governanceMember', ...d })

link('siteSettings', '')
for (const d of fr.domains) link('domain', d.slug)
for (const d of fr.events) link('event', d.slug)
for (const d of fr.posts) link('post', d.slug)
for (const d of fr.publications) link('publication', d.key)
for (const s of Object.keys(fr.pages)) link('page', s)

mkdirSync('.data', { recursive: true })
writeFileSync('.data/seed.ndjson', docs.map((d) => JSON.stringify(d)).join('\n') + '\n')
console.log(`${docs.length} documents → .data/seed.ndjson`)
