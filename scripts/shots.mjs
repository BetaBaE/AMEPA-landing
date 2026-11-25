// Captures d'écran : node scripts/shots.mjs <dossier> [chemin…]   (serveur lancé sur BASE_URL)
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright-core'

const base = process.env.BASE_URL || 'http://localhost:3000'
const [dir = '.data/shots', ...args] = process.argv.slice(2)
const paths = args.length ? args : ['/', '/ar', '/en']
mkdirSync(dir, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
for (const [name, width, height] of [['d', 1440, 900], ['m', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' })
  page.on('console', (m) => m.type() === 'error' && console.log(name, page.url(), m.text().slice(0, 300)))
  page.on('pageerror', (e) => console.log(name, page.url(), 'PAGEERROR', e.message.slice(0, 300)))
  for (const p of paths) {
    const res = await page.goto(base + p, { waitUntil: 'networkidle' })
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    if (over > 0 || res.status() >= 400) console.log(name, p, 'status', res.status(), 'débordement', over)
    await page.screenshot({ path: `${dir}/${name}-${p.replace(/\W+/g, '_') || 'home'}.png`, fullPage: true })
  }
  await page.close()
}
await browser.close()
