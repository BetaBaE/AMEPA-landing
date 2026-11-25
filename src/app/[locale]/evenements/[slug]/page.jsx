import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ViewTransition } from 'react'
import MagneticButton from '@/components/motion/MagneticButton'
import Picture from '@/components/Picture'
import RichText from '@/components/RichText'
import { Arrow, FrenchNotice, PageHeader, T } from '@/components/ui'
import { redirect } from '@/i18n/navigation'
import { formatEventDate, formatSize, isTbc, plain, safeHref } from '@/lib/format'
import { absolute, buildMetadata } from '@/lib/seo'
import { getEvent, getEvents, getTranslations as getDocTranslations, isPast } from '@/sanity/lib/content'
import { hasImage, imageUrl } from '@/sanity/lib/image'

export const revalidate = 3600

export async function generateStaticParams({ params }) {
  return (await getEvents(params.locale)).map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params
  const event = await getEvent(locale, slug)
  if (!event) return {}
  const tr = await getDocTranslations(event)
  const paths = Object.fromEntries(Object.entries(tr).map(([l, s]) => [l, `/evenements/${s}`]))
  return buildMetadata({ locale, canonicalLocale: event.language, path: `/evenements/${slug}`, paths, title: event.title, description: event.summary, image: imageUrl(event.cover, { width: 1200, height: 630 }) })
}

export default async function EventPage({ params }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const event = await getEvent(locale, slug)
  if (!event) notFound()
  const tr = await getDocTranslations(event)
  // L'adresse demandée est celle d'une autre langue : on rejoint la traduction.
  if (event.language !== locale && tr[locale] && tr[locale] !== slug) redirect({ href: `/evenements/${tr[locale]}`, locale })
  const t = await getTranslations({ locale })
  const past = isPast(event)
  const foreign = event.language !== locale ? event.language : undefined
  const register = safeHref(event.registrationUrl)
  const exactDate = event.startDate && !event.dateTbc && !event.monthOnly

  const jsonLd = exactDate && {
    '@context': 'https://schema.org', '@type': 'Event', name: plain(event.title), startDate: event.startDate, ...(event.endDate ? { endDate: event.endDate } : {}),
    ...(isTbc(event.location) ? {} : { location: { '@type': 'Place', name: event.location } }), description: plain(event.summary), url: absolute(locale, `/evenements/${slug}`),
  }

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />}
      <PageHeader title={event.title} intro={event.summary} lang={foreign} crumbs={[{ href: '/evenements', label: t('nav.events') }]} />
      <div className="shell band">
        <FrenchNotice show={foreign} />
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[1fr_20rem]">
          <div className="order-2 lg:order-1">
            {hasImage(event.cover) && <ViewTransition name={`cover-${event._id}`} share="morph" default="none"><div className="mb-10"><Picture image={event.cover} sizes="(min-width: 1024px) 60vw, 100vw" showCredit priority /></div></ViewTransition>}
            {event.body?.length > 0 && <><h2 className="mb-5 text-(length:--text-section)">{t('events.programme')}</h2><RichText value={event.body} lang={foreign} className="text-lg" /></>}
            {event.speakers?.length > 0 && (
              <section aria-labelledby="sp" className="mt-14">
                <h2 id="sp" className="text-(length:--text-section)">{t('events.speakers')}</h2>
                <ul className="mt-6 grid gap-x-10 gap-y-7 sm:grid-cols-2">
                  {event.speakers.map((s, i) => (
                    <li key={s._key ?? i} className="flex gap-5 border-t-2 border-ocean pt-4">
                      {hasImage(s.photo) && <Picture image={s.photo} ratio={[1, 1]} width={192} sizes="80px" grade={false} className="w-20 shrink-0" />}
                      <div><p className="font-display text-lg font-semibold"><T>{s.name}</T></p><p className="text-muted"><T>{s.role}</T></p></div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {event.gallery?.some(hasImage) && (
              <section aria-labelledby="ga" className="mt-14">
                <h2 id="ga" className="mb-6 text-(length:--text-section)">{t('events.gallery')}</h2>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{event.gallery.filter(hasImage).map((g, i) => <Picture key={g._key ?? i} image={g} ratio={[4, 3]} width={800} sizes="(min-width: 768px) 25vw, 50vw" grade={false} />)}</div>
              </section>
            )}
            {event.documents?.some((d) => d.url) && (
              <section aria-labelledby="do" className="mt-14">
                <h2 id="do" className="mb-4 text-(length:--text-section)">{t('events.documents')}</h2>
                <ul>{event.documents.filter((d) => d.url).map((d) => (
                  <li key={d._key} className="border-t border-sand-line py-3 last:border-b"><a href={`${d.url}?dl=`} className="flow-link">{d.title || d.name} <span dir="ltr" className="font-normal">{formatSize(d.size, locale)}</span></a></li>
                ))}</ul>
              </section>
            )}
          </div>
          <aside className="order-1 h-fit bg-sand p-7 lg:sticky lg:top-28 lg:order-2">
            <dl className="space-y-5">
              <div><dt className="text-muted">{t('events.date')}</dt><dd className="font-display text-xl font-semibold leading-snug first-letter:uppercase">{formatEventDate(event, locale, t('events.dateTbc'))}</dd></div>
              {event.location && <div><dt className="text-muted">{t('events.location')}</dt><dd className="font-semibold"><T>{event.location}</T></dd></div>}
              {event.type && <div><dt className="text-muted">{t('events.type')}</dt><dd className="font-semibold">{t(`events.types.${event.type}`)}</dd></div>}
            </dl>
            <div className="mt-7">
              {past ? <p className="font-semibold">{t('events.closed')}</p>
                : register ? <MagneticButton className="grid"><a href={register} rel="noopener noreferrer" className="btn btn-ocean">{t('events.register')}<Arrow /></a></MagneticButton>
                  : <p className="text-muted">{t('events.noRegistration')}</p>}
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
