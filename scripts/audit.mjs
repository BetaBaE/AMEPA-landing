// Contrôle de toutes les pages : accessibilité (axe, WCAG AA), débordements, liens, hreflang, console.
//   BASE_URL=http://localhost:3000 node scripts/audit.mjs
import AxeBuilder from '@axe-core/playwright'
import { chromium } from 'playwright-core'

const base = process.env.BASE_URL || 'http://localhost:3000'
const browser = await chromium.launch({ channel: 'chrome' })
const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } })
const page = await context.newPage()
const problems = []
let where = ''
page.on('console', (m) => m.type() === 'error' && problems.push(`${where} console : ${m.text().slice(0, 200)}`))
page.on('pageerror', (e) => problems.push(`${where} erreur : ${e.message.slice(0, 200)}`))

const queue = ['/', '/ar', '/en', '/credits', '/evenements?vue=calendrier', '/evenements?periode=archives', '/contact?objet=adhesion']
const seen = new Set(queue)
let count = 0
while (queue.length) {
  where = queue.shift()
  const res = await page.goto(base + where, { waitUntil: 'load' })
  count++
  if (!res.ok()) { problems.push(`${where} statut ${res.status()}`); continue }
  await page.waitForTimeout(200)
  const info = await page.evaluate(() => ({
    links: [...document.querySelectorAll('a[href]')].map((a) => a.href),
    hash: [...document.querySelectorAll('a[href^="#"]')].map((a) => a.hash).filter((h) => h.length > 1 && !document.getElementById(h.slice(1))),
    h1: document.querySelectorAll('h1').length, lang: document.documentElement.lang, dir: document.documentElement.dir, title: document.title,
    desc: document.querySelector('meta[name=description]')?.content, canonical: document.querySelector('link[rel=canonical]')?.href,
    hreflang: [...document.querySelectorAll('link[rel=alternate][hreflang]')].map((l) => l.hreflang).sort().join(),
    img: [...document.querySelectorAll('img:not([alt])')].length,
  }))
  const expected = where.startsWith('/ar') ? 'ar rtl' : where.startsWith('/en') ? 'en ltr' : 'fr ltr'
  if (`${info.lang} ${info.dir}` !== expected) problems.push(`${where} lang/dir ${info.lang} ${info.dir}`)
  if (info.h1 !== 1) problems.push(`${where} ${info.h1} h1`)
  if (!info.desc || !info.canonical || info.hreflang !== 'ar,en,fr,x-default') problems.push(`${where} métadonnées : ${info.hreflang} ${info.canonical}`)
  if (info.img || info.hash.length) problems.push(`${where} img sans alt ${info.img}, ancres mortes ${info.hash}`)
  for (const width of [360, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 })
    await page.waitForTimeout(150)
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    if (over > 0) problems.push(`${where} déborde de ${over}px à ${width}px`)
    // overflow-x: clip masque un débordement sans le corriger : on mesure aussi chaque élément.
    const wide = await page.evaluate(() => [...document.querySelectorAll('main *, footer *, header *')].filter((e) => {
      const r = e.getBoundingClientRect()
      return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1) && !e.closest('svg, .chips, .hero-waves, .marquee, .water-bar, .domain-card, [aria-hidden="true"], .sr-only')
    }).slice(0, 2).map((e) => `${e.tagName.toLowerCase()}.${String(e.className).slice(0, 50)}`))
    if (wide.length) problems.push(`${where} élément hors écran à ${width}px : ${wide.join(' ; ')}`)
  }
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze()
  for (const v of axe.violations) problems.push(`${where} axe ${v.impact} ${v.id} ×${v.nodes.length} : ${v.nodes[0].html.slice(0, 160)}`)
  for (const l of info.links) {
    const u = new URL(l)
    const p = u.pathname + u.search
    if (u.origin === base && !seen.has(p)) { seen.add(p); queue.push(p) }
  }
}
await browser.close()
console.log(`${count} pages contrôlées, ${problems.length} problème(s)`)
for (const p of problems) console.log(' -', p)
process.exit(problems.length ? 1 : 0)
