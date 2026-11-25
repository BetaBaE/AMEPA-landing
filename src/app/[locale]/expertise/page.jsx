import { getTranslations, setRequestLocale } from 'next-intl/server'
import DomainCard from '@/components/motion/DomainCard'
import { RevealGroup } from '@/components/motion/Reveal'
import Sections from '@/components/Sections'
import { PageHeader, T } from '@/components/ui'
import { formatDate, safeHref } from '@/lib/format'
import { buildMetadata } from '@/lib/seo'
import { getDomains, getOpportunities, getPage } from '@/sanity/lib/content'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'expertise' })
  return buildMetadata({ locale, path: '/expertise', title: t('title'), description: t('intro') })
}

export default async function ExpertisePage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale })
  const [domains, innovation, opportunities] = await Promise.all([getDomains(locale), getPage(locale, 'innovation'), getOpportunities(locale)])
  const today = new Date().toISOString().slice(0, 10)
  const calls = opportunities.filter((o) => o.kind === 'Appel à projets' && (!o.deadline || o.deadline >= today))

  return (
    <>
      <PageHeader title={t('expertise.title')} intro={t('expertise.intro')} />
      <section aria-label={t('home.domains')} className="bg-sand">
        <div className="shell py-12 md:py-16">
          <RevealGroup className="cells grid gap-px sm:grid-cols-2 lg:grid-cols-3" itemClassName="grid">
            {domains.map((d) => <DomainCard key={d._id} domain={d} headingLevel="h2" />)}
          </RevealGroup>
        </div>
      </section>
      <div className="shell">
        {innovation && <Sections sections={innovation.sections} lang={innovation.language} />}
        <section id="appels" aria-labelledby="h-appels" className="grid gap-x-12 gap-y-6 border-t border-sand-line py-12 md:py-16 lg:grid-cols-[17rem_1fr]">
          <h2 id="h-appels" className="text-(length:--text-section)">{t('expertise.calls')}</h2>
          {calls.length ? (
            <ul className="space-y-6">
              {calls.map((c) => (
                <li key={c._id} className="border-t-2 border-ocean pt-4">
                  <h3 className="text-xl"><T>{c.title}</T></h3>
                  {c.summary && <p className="mt-2 text-muted"><T>{c.summary}</T></p>}
                  {c.deadline && <p className="mt-2">{t('opportunities.deadline')} : <strong>{formatDate(c.deadline, locale)}</strong></p>}
                  {safeHref(c.link) && <a className="flow-link mt-2" href={c.link} rel="noopener noreferrer">{t('opportunities.link')}</a>}
                </li>
              ))}
            </ul>
          ) : <p className="text-muted">{t('expertise.callsEmpty')}</p>}
        </section>
      </div>
    </>
  )
}
