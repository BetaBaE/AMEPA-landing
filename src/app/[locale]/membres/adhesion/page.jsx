import { getTranslations, setRequestLocale } from 'next-intl/server'
import Sections from '@/components/Sections'
import SiteForm from '@/components/SiteForm'
import { FrenchNotice, PageHeader } from '@/components/ui'
import { buildMetadata } from '@/lib/seo'
import { getPage } from '@/sanity/lib/content'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { locale } = await params
  const page = await getPage(locale, 'adhesion')
  return buildMetadata({ locale, path: '/membres/adhesion', title: page.title, description: page.intro })
}

export default async function JoinPage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale })
  const page = await getPage(locale, 'adhesion')
  return (
    <>
      <PageHeader title={page.title} intro={page.intro} crumbs={[{ href: '/membres', label: t('nav.members') }]}>
        <a href="#formulaire" className="btn btn-aqua">{t('members.joinCta')}</a>
      </PageHeader>
      <div className="shell">
        <FrenchNotice show={page.language !== locale} />
        <Sections sections={page.sections} lang={page.language} />
        <section id="formulaire" aria-labelledby="h-form" className="grid gap-x-12 gap-y-6 border-t border-sand-line py-12 md:py-16 lg:grid-cols-[17rem_1fr]">
          <h2 id="h-form" className="text-(length:--text-section)">{t('members.joinCta')}</h2>
          <SiteForm formType="adhesion" />
        </section>
      </div>
    </>
  )
}
