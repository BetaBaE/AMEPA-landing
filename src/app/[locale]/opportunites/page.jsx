import { getTranslations, setRequestLocale } from 'next-intl/server'
import { OpportunitiesExplorer } from '@/components/explorers'
import { PageHeader } from '@/components/ui'
import { Link } from '@/i18n/navigation'
import { buildMetadata } from '@/lib/seo'
import { getOpportunities } from '@/sanity/lib/content'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'opportunities' })
  return buildMetadata({ locale, path: '/opportunites', title: t('title'), description: t('intro') })
}

export default async function OpportunitiesPage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'opportunities' })
  const today = new Date().toISOString().slice(0, 10)
  const all = (await getOpportunities(locale)).map((o) => ({ ...o, closed: Boolean(o.deadline && o.deadline < today) }))
  const ordered = [...all.filter((o) => !o.closed).reverse(), ...all.filter((o) => o.closed)]
  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />
      <div className="shell py-12 md:py-16"><OpportunitiesExplorer opportunities={ordered} /></div>
      <section aria-labelledby="match" className="bg-sand">
        <div className="shell flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl"><h2 id="match" className="text-(length:--text-section)">{t('matchTitle')}</h2><p className="mt-2 text-muted">{t('matchText')}</p></div>
          <Link href="/contact?objet=partenariat" className="btn btn-ocean shrink-0">{t('matchCta')}</Link>
        </div>
      </section>
    </>
  )
}
