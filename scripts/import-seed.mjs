// Importe .data/seed.ndjson dans Sanity : npm run seed && npm run seed:import
// createIfNotExists : un document déjà présent (ou modifié dans le Studio) n'est jamais écrasé.
import { readFileSync } from 'node:fs'
import { createClient } from '@sanity/client'

const { NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, NEXT_PUBLIC_SANITY_DATASET: dataset, SANITY_API_WRITE_TOKEN: token } = process.env
if (!projectId || !dataset || !token) { console.error('Variables Sanity manquantes dans .env.local'); process.exit(1) }

const client = createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false, perspective: 'raw' })
const docs = readFileSync('.data/seed.ndjson', 'utf8').trim().split('\n').map((l) => JSON.parse(l))
const existing = new Set(await client.fetch('*[_id in $ids]._id', { ids: docs.map((d) => d._id) }))
const tx = client.transaction()
for (const d of docs) tx.createIfNotExists(d)
await tx.commit({ visibility: 'sync' })
console.log(`${docs.length - existing.size} documents créés, ${existing.size} déjà présents et laissés tels quels`)
