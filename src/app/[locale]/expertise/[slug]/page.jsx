import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { EventRow, PublicationRow } from '@/components/cards'
import Picture from '@/components/Picture'
import RichText from '@/components/RichText'
import { Arrow, FrenchNotice, PageHeader, SectionHead, T } from '@/components/ui'
import { Link } from '@/i18n/navigation'
import { buildMetadata } from '@/lib/seo'
import { getDomain, getDomains, getEvents, getPublications, getTranslations as getDocTranslations, isPast, sortUpcoming } from '@/sanity/lib/content'

export const revalidate = 3600

export async function generateStaticParams({ params }) {
  return (await getDomains(params.locale)).map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params
  const domain = await getDomain(locale, slug)
  if (!domain) return {}
  const tr = await getDocTranslations(domain)
  const paths = Object.fromEntries(Object.entries(tr).map(([l, s]) => [l, `/expertise/${s}`]))
  return buildMetadata({ locale, canonicalLocale: domain.language, path: `/expertise/${slug}`, paths, title: domain.title, description: domain.intro })
}

export default async function DomainPage({ params }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const [domain, domains, events, publications] = await Promise.all([getDomain(locale, slug), getDomains(locale), getEvents(locale), getPublications(locale)])
  if (!domain) notFound()
  const t = await getTranslations({ locale })
  const i = domains.findIndex((d) => d.slug === slug)
  const prev = domains[i - 1]
  const next = domains[i + 1]
  const relatedEvents = events.filter((e) => e.domains?.includes(slug) && !isPast(e)).sort(sortUpcoming).slice(0, 3)
  const relatedPubs = publications.filter((p) => p.domains?.includes(slug)).slice(0, 3)

  return (
    <>
      <PageHeader title={domain.title} intro={domain.intro} crumbs={[{ href: '/expertise', label: t('nav.expertise') }]} lang={domain.language !== locale ? domain.language : undefined} />
      <div className="shell band">
        <FrenchNotice show={domain.language !== locale} />
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[1.25fr_1fr]">
          <RichText value={domain.body} lang={domain.language !== locale ? domain.language : undefined} className="text-lg" />
          <div>
            <Picture image={domain.image} icon={domain.icon} sizes="(min-width: 1024px) 40vw, 100vw" showCredit priority />
            {domain.keyStakes?.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl">{t('expertise.stakes')}</h2>
                <ul className="mt-4">{domain.keyStakes.map((s) => <li key={s} className="border-t border-sand-line py-3.5 last:border-b"><T>{s}</T></li>)}</ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {relatedEvents.length > 0 && <section aria-labelledby="ev" className="shell pb-16"><SectionHead id="ev" title={t('expertise.relatedEvents')} />{relatedEvents.map((e) => <EventRow key={e._id} event={e} />)}</section>}
      {relatedPubs.length > 0 && <section aria-labelledby="pu" className="shell pb-16"><SectionHead id="pu" title={t('expertise.relatedPublications')} />{relatedPubs.map((p) => <PublicationRow key={p._id} publication={p} />)}</section>}

      <nav aria-label={t('expertise.all')} className="border-t border-sand-line bg-sand">
        <div className="shell grid gap-x-8 sm:grid-cols-2">
          {[[prev, 'previous'], [next, 'next']].map(([d, key]) => d ? (
            <Link key={key} href={`/expertise/${d.slug}`} className={`group block py-8 ${key === 'next' ? 'sm:col-start-2 sm:text-end' : ''}`}>
              <span className="text-muted">{t(`expertise.${key}`)}</span>
              <span className={`mt-1 flex items-center gap-3 font-display text-xl font-semibold underline-offset-4 group-hover:underline ${key === 'next' ? 'sm:justify-end' : 'flex-row-reverse justify-end'}`}>
                {d.title}{key === 'next' ? <Arrow /> : <span className="rotate-180"><Arrow /></span>}
              </span>
            </Link>
          ) : null)}
        </div>
      </nav>
    </>
  )
}
