import { setRequestLocale } from 'next-intl/server'
import Sections from '@/components/Sections'
import { FrenchNotice, PageHeader } from '@/components/ui'
import { buildMetadata } from '@/lib/seo'
import { getPage } from '@/sanity/lib/content'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const { locale } = await params
  const page = await getPage(locale, 'mentions-legales')
  return buildMetadata({ locale, path: '/mentions-legales', title: page.title, description: page.intro })
}

export default async function LegalPage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const page = await getPage(locale, 'mentions-legales')
  return (
    <>
      <PageHeader title={page.title} intro={page.intro} />
      <div className="shell"><FrenchNotice show={page.language !== locale} /><Sections sections={page.sections} lang={page.language} /></div>
    </>
  )
}
