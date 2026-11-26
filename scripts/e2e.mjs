// Parcours critiques dans un vrai navigateur : menu, langues, filtres, formulaires.
//   BASE_URL=http://localhost:3000 node scripts/e2e.mjs
import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
import ar from '../src/i18n/ar.json' with { type: 'json' }

const base = process.env.BASE_URL || 'http://localhost:3000'
const browser = await chromium.launch({ channel: 'chrome' })
const page = await (await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } })).newPage()
const step = async (name, fn) => { try { await fn(); console.log('ok  ', name) } catch (e) { console.log('FAIL', name, '\n    ', e.message.split('\n').slice(0, 4).join('\n     ')); process.exitCode = 1 } }
const go = async (path) => { await page.goto(base + path, { waitUntil: 'load' }); await page.waitForTimeout(700) }

await step('navigation vers Expertise puis un domaine', async () => {
  await go('/')
  await page.locator('header nav >> text=Expertise').first().click()
  await page.waitForURL('**/expertise')
  await page.locator('article a', { hasText: 'Dessalement' }).click()
  await page.waitForURL('**/expertise/dessalement')
  assert.match(await page.locator('h1').innerText(), /Dessalement/)
})
await step('changement de langue FR → AR → EN → FR sur la même page', async () => {
  for (const [short, url, dir] of [['AR', '/ar/expertise/dessalement', 'rtl'], ['EN', '/en/expertise/dessalement', 'ltr'], ['FR', '/expertise/dessalement', 'ltr']]) {
    await page.locator('header a', { hasText: new RegExp(`^${short}$`) }).click()
    await page.waitForURL(base + url)
    assert.equal(await page.evaluate(() => document.documentElement.dir), dir)
    await page.waitForTimeout(400)
  }
})
await step('annuaire : recherche, catégorie, état vide', async () => {
  await go('/membres')
  await page.locator('input[type=search]').fill('onee')
  await page.waitForFunction(() => /^1 membre/.test(document.querySelector('[role=status]').textContent))
  assert.match(page.url(), /q=onee/)
  await page.locator('input[type=search]').fill('zzzz')
  await page.getByText('Aucun membre ne correspond').waitFor()
  await page.getByRole('button', { name: 'Effacer les filtres' }).click()
  await page.waitForFunction(() => /^6 membres/.test(document.querySelector('[role=status]').textContent))
  assert.equal(await page.locator('input[type=search]').inputValue(), '')
  await page.getByRole('button', { name: 'Industriel', exact: true }).click()
  await page.waitForFunction(() => /^1 membre/.test(document.querySelector('[role=status]').textContent))
  await go('/membres?categorie=Industriel')
  assert.match(await page.locator('[role=status]').first().innerText(), /^1 membre/)
})
await step('événements : archives et calendrier', async () => {
  await go('/evenements')
  await page.getByRole('button', { name: 'Archives' }).click()
  await page.getByRole('heading', { name: 'Dutch Moroccan Water Days' }).waitFor()
  await page.getByRole('button', { name: 'Calendrier' }).click()
  const before = await page.locator('main h2').first().innerText()
  await page.getByRole('button', { name: 'Mois suivant' }).click()
  assert.notEqual(await page.locator('main h2').first().innerText(), before)
})
await step('bibliothèque : filtre par domaine', async () => {
  await go('/ressources')
  await page.locator('main select').first().selectOption('dessalement')
  await page.waitForFunction(() => /^1 document/.test(document.querySelector('[role=status]').textContent))
})
await step('formulaire : erreurs affichées et focus sur le premier champ', async () => {
  await go('/contact')
  await page.getByRole('button', { name: 'Envoyer le message' }).click()
  await page.getByText('Ce champ est obligatoire.').first().waitFor()
  assert.equal(await page.evaluate(() => document.activeElement.name), 'name')
})
await step('formulaire : envoi (statut selon la configuration du serveur)', async () => {
  const main = page.locator('main form')
  await main.locator('[name=name]').fill('Test automatique')
  await main.locator('[name=email]').fill('test@example.com')
  await main.locator('[name=message]').fill('Message de test.')
  await main.locator('[name=consent]').check()
  await page.waitForTimeout(1600)
  const [res] = await Promise.all([page.waitForResponse('**/api/forms'), page.getByRole('button', { name: 'Envoyer le message' }).click()])
  console.log('      réponse', res.status())
  await page.getByText(res.ok() ? 'Message envoyé.' : "L’envoi a échoué").waitFor()
})
await step('formulaire adhésion depuis /contact?objet=adhesion', async () => {
  await go('/contact?objet=adhesion')
  assert.equal(await page.locator('main [name=category] option').count(), 9)
})
await step('API : type inconnu, champ invalide, pot de miel', async () => {
  const post = (data) => page.request.post(`${base}/api/forms`, { data, headers: { 'x-forwarded-for': '203.0.113.9' } })
  assert.equal((await post({ formType: 'x' })).status(), 400)
  assert.equal((await post({ formType: 'newsletter', email: 'pas-un-email', consent: true, elapsed: 5000 })).status(), 422)
  assert.equal((await post({ formType: 'newsletter', email: 'a@b.ma', consent: true, elapsed: 5000, website: 'spam' })).status(), 200)
  assert.equal((await page.request.post(`${base}/api/revalidate`, { data: { _type: 'post' } })).ok(), false)
})
await step('menu déroulant : clic souris, lien vers une section, Échap au clavier', async () => {
  await go('/expertise')
  await page.locator('[data-menu=amepa]').click()
  await page.locator('#menu-amepa a', { hasText: 'Missions' }).click()
  await page.waitForURL('**/amepa#missions')
  await page.waitForTimeout(1600)
  const top = await page.evaluate(() => document.getElementById('missions').getBoundingClientRect().top)
  assert.ok(top > -5 && top < 220, `section à ${top}px`)
  await page.goBack()
  await page.waitForURL('**/expertise')
  await page.mouse.move(640, 800)
  await page.locator('[data-menu=members]').focus()
  await page.keyboard.press('Enter')
  await page.locator('#menu-members').waitFor()
  await page.keyboard.press('Escape')
  await page.locator('#menu-members').waitFor({ state: 'detached' })
  assert.equal(await page.evaluate(() => document.activeElement.dataset.menu), 'members')
})
await step('filtres : clics rapides sans carte fantôme', async () => {
  await go('/membres')
  for (let i = 0; i < 12; i++) await page.locator('.chips button').nth(i % 6).click()
  await page.locator('.chips button').first().click()
  await page.waitForTimeout(1200)
  assert.equal(await page.locator('.cells article').count(), 6)
  assert.ok(await page.evaluate(() => [...document.querySelectorAll('.cells > *')].every((e) => getComputedStyle(e).opacity === '1')))
})
await step('menu mobile : ouverture, Échap, navigation', async () => {
  await page.setViewportSize({ width: 390, height: 844 })
  await go('/')
  const btn = page.getByRole('button', { name: 'Ouvrir le menu' })
  await btn.click()
  await page.locator('#menu-mobile').waitFor({ state: 'visible' })
  for (let i = 0; i < 14; i++) { await page.keyboard.press('Tab'); assert.ok(await page.evaluate(() => Boolean(document.activeElement.closest('#menu-mobile'))), 'focus hors du menu') }
  await page.keyboard.press('Escape')
  await page.locator('#menu-mobile').waitFor({ state: 'hidden' })
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Ouvrir le menu')
  await btn.click()
  await page.locator('#menu-mobile a', { hasText: 'Membres' }).click()
  await page.waitForURL('**/membres')
  await page.locator('#menu-mobile').waitFor({ state: 'hidden' })
})
await step('page 404 traduite', async () => {
  const res = await page.goto(`${base}/ar/inconnu`)
  assert.equal(res.status(), 404)
  await page.getByRole('heading', { name: ar.notFound.title }).waitFor()
})
await browser.close()
