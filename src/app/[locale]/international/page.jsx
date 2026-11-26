import { getTranslations, setRequestLocale } from 'next-intl/server'
import CooperationMap from '@/components/motion/CooperationMap'
import { EventRow } from '@/components/cards'
import Sections from '@/components/Sections'
import { FrenchNotice, T, WaveEdge } from '@/components/ui'
import { Link } from '@/i18n/navigation'
import { buildMetadata } from '@/lib/seo'
import { getEvents, getPage, getPartnerCountries, isPast, sortUpcoming } from '@/sanity/lib/content'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { locale } = await params
  const page = await getPage(locale, 'international')
  return buildMetadata({ locale, path: '/international', title: page.title, description: page.intro })
}

export default async function InternationalPage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale })
  const [page, events, partners] = await Promise.all([getPage(locale, 'international'), getEvents(locale), getPartnerCountries()])
  const regions = new Intl.DisplayNames([locale], { type: 'region' })
  const countries = partners.map((c) => ({ code: c.code, name: regions.of(c.code), description: { ar: c.descriptionAr, en: c.descriptionEn }[locale] || c.description }))
  const missions = events.filter((e) => e.type === 'Rencontre B2B')
  const upcoming = missions.filter((e) => !isPast(e)).sort(sortUpcoming)
  const past = missions.filter((e) => isPast(e)).reverse()

  return (
    <>
      <header data-dark="" className="zellige on-ocean under-header overflow-x-clip bg-ocean text-white">
        <div className="shell grid items-center gap-x-12 gap-y-4 pt-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="pb-4 lg:pb-16">
            <nav aria-label={t('nav.breadcrumb')} className="text-[0.9375rem] text-mist"><Link href="/" className="inline-block py-1 underline-offset-4 hover:underline">{t('nav.home')}</Link></nav>
            <h1 className="rise mt-6 text-(length:--text-title)"><T>{page.title}</T></h1>
            <p className="rise mt-5 max-w-xl text-lg text-mist" style={{ '--i': 1 }}><T>{page.intro}</T></p>
            <p className="rise mt-8" style={{ '--i': 2 }}><Link href="/contact?objet=partenariat" className="btn btn-aqua">{t('international.cta')}</Link></p>
          </div>
          <CooperationMap countries={countries} className="mx-auto mb-8 w-full max-w-md" />
        </div>
        <WaveEdge />
      </header>
      <div className="shell">
        <FrenchNotice show={page.language !== locale} />
        <Sections sections={page.sections} lang={page.language} />
        <section id="missions" aria-labelledby="h-missions" className="border-t border-sand-line py-12 md:py-16">
          <h2 id="h-missions" className="mb-8 text-(length:--text-section)">{t('international.missions')}</h2>
          {missions.length ? <div className="border-b border-sand-line">{[...upcoming, ...past].map((e) => <EventRow key={e._id} event={e} />)}</div> : <p className="text-muted">{t('international.missionsEmpty')}</p>}
        </section>
      </div>
    </>
  )
}
