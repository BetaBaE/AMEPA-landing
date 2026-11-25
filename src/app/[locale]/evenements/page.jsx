import { getTranslations, setRequestLocale } from 'next-intl/server'
import { EventsExplorer } from '@/components/explorers'
import { PageHeader } from '@/components/ui'
import { buildMetadata } from '@/lib/seo'
import { getDomains, getEvents, isPast, sortUpcoming } from '@/sanity/lib/content'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'events' })
  return buildMetadata({ locale, path: '/evenements', title: t('title'), description: t('intro') })
}

export default async function EventsPage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'events' })
  const [events, domains] = await Promise.all([getEvents(locale), getDomains(locale)])
  const now = new Date()
  const list = [...events].sort(sortUpcoming).map(({ body, ...e }) => ({ ...e, past: isPast(e, now) }))
  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />
      <div className="shell py-12 md:py-16">
        <EventsExplorer events={list} domains={domains.map(({ slug, title }) => ({ slug, title }))} now={now.toISOString()} />
      </div>
    </>
  )
}
