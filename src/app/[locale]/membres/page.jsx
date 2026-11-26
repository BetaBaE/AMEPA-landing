import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MembersExplorer } from '@/components/explorers'
import { PageHeader } from '@/components/ui'
import { Link } from '@/i18n/navigation'
import { buildMetadata } from '@/lib/seo'
import { getMembers } from '@/sanity/lib/content'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'members' })
  return buildMetadata({ locale, path: '/membres', title: t('title'), description: t('intro') })
}

export default async function MembersPage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'members' })
  const members = await getMembers()
  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />
      <div className="shell py-12 md:py-16"><MembersExplorer members={members} /></div>
      <section aria-labelledby="join" className="bg-sand">
        <div className="shell flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div><h2 id="join" className="text-(length:--text-section)">{t('joinTitle')}</h2><p className="mt-2 text-muted">{t('joinText')}</p></div>
          <Link href="/membres/adhesion" className="btn btn-ocean shrink-0">{t('joinCta')}</Link>
        </div>
      </section>
    </>
  )
}
