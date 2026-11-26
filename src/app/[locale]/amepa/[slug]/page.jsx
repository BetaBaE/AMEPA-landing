import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Sections from '@/components/Sections'
import { FrenchNotice, PageHeader } from '@/components/ui'
import { buildMetadata } from '@/lib/seo'
import { getPage, getPageSlugs, getTranslations as getDocTranslations } from '@/sanity/lib/content'

export const revalidate = 60

// Pages qui ont déjà leur propre adresse sur le site.
const RESERVED = ['amepa', 'international', 'innovation', 'adhesion', 'mentions-legales']

export async function generateStaticParams({ params }) {
  const slugs = await getPageSlugs()
  return slugs.filter((p) => p.language === params.locale && !RESERVED.includes(p.slug)).map(({ slug }) => ({ slug }))
}

const load = async (params) => {
  const { locale, slug } = await params
  const page = RESERVED.includes(slug) ? null : await getPage(locale, slug)
  return { locale, page }
}

export async function generateMetadata({ params }) {
  const { locale, page } = await load(params)
  if (!page) return {}
  const translations = await getDocTranslations(page)
  const paths = Object.fromEntries(Object.entries(translations).map(([l, s]) => [l, `/amepa/${s}`]))
  return buildMetadata({ locale, canonicalLocale: page.language, path: `/amepa/${page.slug}`, paths, title: page.title, description: page.intro })
}

export default async function GenericPage({ params }) {
  const { locale, page } = await load(params)
  setRequestLocale(locale)
  if (!page) notFound()
  const t = await getTranslations({ locale, namespace: 'nav' })
  return (
    <>
      <PageHeader title={page.title} intro={page.intro} crumbs={[{ href: '/amepa', label: t('amepa') }]} />
      <div className="shell py-4"><FrenchNotice show={page.language !== locale} /><Sections sections={page.sections} lang={page.language} /></div>
    </>
  )
}
