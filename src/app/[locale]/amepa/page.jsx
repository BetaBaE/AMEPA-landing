import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PublicationRow } from '@/components/cards'
import Accordion from '@/components/motion/Accordion'
import Picture from '@/components/Picture'
import Sections from '@/components/Sections'
import { FrenchNotice, PageHeader, T } from '@/components/ui'
import { hasImage } from '@/sanity/lib/image'
import { buildMetadata } from '@/lib/seo'
import { getGovernance, getPage, getPublications } from '@/sanity/lib/content'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { locale } = await params
  const page = await getPage(locale, 'amepa')
  return buildMetadata({ locale, path: '/amepa', title: page.title, description: page.intro })
}

export default async function AmepaPage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale })
  const [page, governance, publications] = await Promise.all([getPage(locale, 'amepa'), getGovernance(), getPublications(locale)])
  const reports = publications.filter((p) => p.kind === "Rapport d'activité")
  const organs = ['Bureau', 'CA', 'AG', 'Comité'].map((o) => [o, governance.filter((g) => g.organ === o)]).filter(([, list]) => list.length)
  const role = (g) => ({ ar: g.roleAr, en: g.roleEn })[locale] || g.role
  const anchors = [...(page.sections ?? []).filter((s) => s.anchor).map((s) => [s.anchor, s.title]), ['gouvernance', t('amepa.governance')], ['rapports', t('amepa.reports')]]

  return (
    <>
      <PageHeader title={page.title} intro={page.intro} />
      <nav aria-label={t('amepa.onThisPage')} className="border-b border-sand-line bg-sand">
        <ul className="shell flex flex-wrap gap-x-8 gap-y-1 py-3">
          {anchors.map(([id, label]) => <li key={id}><a href={`#${id}`} className="inline-block py-2 font-medium underline-offset-4 hover:underline">{label}</a></li>)}
        </ul>
      </nav>
      <div className="shell">
        <FrenchNotice show={page.language !== locale} />
        <Sections sections={page.sections} lang={page.language} />

        <section id="gouvernance" aria-labelledby="h-gouvernance" className="grid gap-x-12 gap-y-6 border-t border-sand-line py-12 md:py-16 lg:grid-cols-[17rem_1fr]">
          <div><h2 id="h-gouvernance" className="text-(length:--text-section)">{t('amepa.governance')}</h2><p className="mt-3 text-muted">{t('amepa.governanceIntro')}</p></div>
          {organs.length ? (
            <Accordion defaultOpen={0} items={organs.map(([organ, list]) => ({ key: organ, title: t(`amepa.organs.${organ}`), content: (
              <ul className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
                {list.map((g) => (
                  <li key={g._id} className="flex gap-5 border-t-2 border-ocean pt-4">
                    {hasImage(g.photo) && <Picture image={g.photo} ratio={[1, 1]} width={192} sizes="96px" grade={false} className="w-24 shrink-0" />}
                    <div><p className="font-display text-lg font-semibold"><T>{g.name}</T></p><p className="text-muted">{[role(g), g.organisation].filter(Boolean).join(', ')}</p></div>
                  </li>
                ))}
              </ul>
            ) }))} />
          ) : <p className="text-muted">{t('amepa.empty')}</p>}
        </section>

        <section id="rapports" aria-labelledby="h-rapports" className="grid gap-x-12 gap-y-6 border-t border-sand-line py-12 md:py-16 lg:grid-cols-[17rem_1fr]">
          <h2 id="h-rapports" className="text-(length:--text-section)">{t('amepa.reports')}</h2>
          {reports.length ? <div className="border-b border-sand-line">{reports.map((p) => <PublicationRow key={p._id} publication={p} />)}</div> : <p className="text-muted">{t('resources.empty')}</p>}
        </section>
      </div>
    </>
  )
}
