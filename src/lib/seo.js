import { getTranslations } from 'next-intl/server'
import { localePath, routing } from '@/i18n/routing'
import { plain } from './format'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

export const absolute = (locale, path) => `${SITE_URL}${localePath(locale, path)}`

const OG_LOCALE = { fr: 'fr_MA', ar: 'ar_MA', en: 'en_GB' }

// `paths` : adresse par langue, quand elle varie d'une langue à l'autre.
// Une langue absente de `paths` n'est pas annoncée dans hreflang.
export async function buildMetadata({ locale, path, paths, canonicalLocale = locale, title, description, image, type = 'website' }) {
  const t = await getTranslations({ locale, namespace: 'meta' })
  const all = paths ?? Object.fromEntries(routing.locales.map((l) => [l, path]))
  const languages = Object.fromEntries(Object.entries(all).map(([l, p]) => [l, absolute(l, p)]))
  if (all.fr) languages['x-default'] = absolute('fr', all.fr)
  const desc = plain(description || t('tagline'), t('tbc')).slice(0, 180)
  const pageTitle = title ? plain(title, t('tbc')) : undefined
  return {
    ...(pageTitle ? { title: pageTitle } : {}),
    description: desc,
    alternates: { canonical: absolute(canonicalLocale, all[canonicalLocale] ?? path), languages },
    openGraph: {
      type, siteName: t('fullName'), title: pageTitle ?? t('fullName'), description: desc,
      locale: OG_LOCALE[locale], url: absolute(canonicalLocale, all[canonicalLocale] ?? path),
      images: [{ url: image ?? '/og.png', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' },
  }
}
