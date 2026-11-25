// Photos sous licence Unsplash, selon le skill site-images.
//   node --env-file=.env.local scripts/unsplash.mjs search "desalination plant"
//   node --env-file=.env.local scripts/unsplash.mjs get <id> expertise/dessalement [--hero]
// `get` signale le téléchargement à Unsplash, enregistre le fichier et complète CREDITS.md.
import { appendFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const key = process.env.UNSPLASH_ACCESS_KEY
if (!key) { console.error('UNSPLASH_ACCESS_KEY manquant dans .env.local (clé gratuite : unsplash.com/developers)'); process.exit(1) }
const SECTIONS = ['hero', 'expertise', 'events', 'international', 'resources', 'backgrounds']
const app = encodeURIComponent(process.env.UNSPLASH_APP_NAME || 'website')
const api = async (url) => {
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${key}`, 'Accept-Version': 'v1' } })
  if (!res.ok) throw new Error(`Unsplash ${res.status} ${await res.text()}`)
  return res.json()
}

const [command, arg, target, flag] = process.argv.slice(2)
if (command === 'search' && arg) {
  const q = new URLSearchParams({ query: arg, orientation: 'landscape', content_filter: 'high', per_page: '8' })
  const { results } = await api(`https://api.unsplash.com/search/photos?${q}`)
  for (const p of results) console.log(`${p.id}  ${p.user.name}\n   ${p.alt_description ?? ''}\n   ${p.urls.small}\n   ${p.links.html}\n`)
} else if (command === 'get' && arg && /^[a-z]+\/[a-z0-9-]+$/.test(target ?? '') && SECTIONS.includes(target.split('/')[0])) {
  const p = await api(`https://api.unsplash.com/photos/${encodeURIComponent(arg)}`)
  await api(p.links.download_location)
  // Hero limité à 2000 px pour rester sous 400 Ko.
  const src = new URL(flag === '--hero' ? p.urls.full : p.urls.regular)
  if (flag === '--hero') { src.searchParams.set('w', '2000'); src.searchParams.set('q', '60') }
  const data = Buffer.from(await (await fetch(src)).arrayBuffer())
  const file = path.join('public/images', `${target}.jpg`)
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, data)
  await appendFile('public/images/CREDITS.md', `| ${target}.jpg | ${p.user.name.replaceAll('|', ' ')} | ${p.links.html}?utm_source=${app}&utm_medium=referral | ${new Date().toISOString().slice(0, 10)} |\n`)
  console.log(`${file} (${Math.round(data.length / 1024)} Ko)${data.length > 400 * 1024 ? ' : trop lourd, à compresser' : ''}`)
} else {
  console.log(`Usage : search "<requête>" | get <id> <section>/<nom> [--hero]   sections : ${SECTIONS.join(', ')}`)
}
