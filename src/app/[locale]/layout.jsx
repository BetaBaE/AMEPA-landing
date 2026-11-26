import '../globals.css'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Inter, Sora } from 'next/font/google'
import { notFound } from 'next/navigation'
import { ViewTransition } from 'react'
import { preload } from 'react-dom'
import Footer from '@/components/Footer'
import Intro from '@/components/motion/Intro'
import MotionProvider from '@/components/motion/MotionProvider'
import SiteHeader from '@/components/motion/SiteHeader'
import WaterScrollbar from '@/components/motion/WaterScrollbar'
import { isRtl, routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/seo'
import { getDomains, getPage } from '@/sanity/lib/content'

const heading = Sora({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-heading', display: 'swap' })
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' })

export const viewport = { themeColor: '#0b2a4a' }

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }))

export async function generateMetadata({ params }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `AMEPA, ${t('fullName')}`, template: `%s | AMEPA` },
    description: t('tagline'),
  }
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  if (locale === 'ar') for (const weight of [400, 600]) preload(`/fonts/plex-arabic-${weight}.woff2`, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
  const t = await getTranslations({ locale, namespace: 'nav' })
  const [domains, amepa] = await Promise.all([getDomains(locale), getPage(locale, 'amepa')])
  const menu = {
    domains: domains.map(({ slug, title }) => ({ slug, title })),
    sections: (amepa?.sections ?? []).filter((s) => s.anchor).map(({ anchor, title }) => ({ anchor, title })),
  }

  return (
    <html lang={locale} dir={isRtl(locale) ? 'rtl' : 'ltr'} className={`${heading.variable} ${body.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <Intro />
        <noscript><style>{'.accordion-panel{height:auto!important;opacity:1!important}'}</style></noscript>
        <NextIntlClientProvider>
          <MotionProvider>
          <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:bg-ocean focus:px-5 focus:py-3 focus:text-white">{t('skip')}</a>
          <SiteHeader {...menu} />
          <main id="contenu" tabIndex={-1} className="flex-1 overflow-x-clip outline-none"><ViewTransition default="page-fade">{children}</ViewTransition></main>
          <Footer locale={locale} />
          <WaterScrollbar />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
