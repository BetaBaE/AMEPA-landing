import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['fr', 'ar', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed', // /contact (fr), /ar/contact, /en/contact
  localeDetection: false,
  alternateLinks: false, // hreflang générés dans les métadonnées de chaque page
})

// Adresse d'une page dans une langue : /contact, /ar/contact, /en/contact.
export const localePath = (locale, path = '/') => {
  const p = path === '/' ? '' : path
  return locale === routing.defaultLocale ? p || '/' : `/${locale}${p}`
}

export const isRtl = (locale) => locale === 'ar'
