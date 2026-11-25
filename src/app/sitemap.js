import { routing } from '@/i18n/routing'
import { absolute } from '@/lib/seo'
import { getDomains, getEvents, getPageSlugs, getPosts } from '@/sanity/lib/content'

export const revalidate = 3600

const STATIC = ['/', '/amepa', '/expertise', '/evenements', '/international', '/membres', '/membres/adhesion', '/ressources', '/opportunites', '/actualites', '/contact', '/mentions-legales']

export default async function sitemap() {
  const statics = STATIC.flatMap((path) => routing.locales.map((locale) => ({
    url: absolute(locale, path),
    alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, absolute(l, path)])) },
  })))

  const dynamic = await Promise.all(routing.locales.map(async (locale) => {
    const [domains, events, posts] = await Promise.all([getDomains(locale), getEvents(locale), getPosts(locale)])
    // Une page affichée en français faute de traduction n'est déclarée qu'en français.
    const own = (list, base) => list.filter((d) => d.language === locale).map((d) => ({ url: absolute(locale, `${base}/${d.slug}`) }))
    return [...own(domains, '/expertise'), ...own(events, '/evenements'), ...own(posts, '/actualites')]
  }))

  const reserved = ['amepa', 'international', 'innovation', 'adhesion', 'mentions-legales']
  const pages = (await getPageSlugs()).filter((p) => !reserved.includes(p.slug)).map((p) => ({ url: absolute(p.language, `/amepa/${p.slug}`) }))

  return [...statics, ...dynamic.flat(), ...pages]
}
