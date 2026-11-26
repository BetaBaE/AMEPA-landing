import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ViewTransition } from 'react'
import { artFor } from '@/components/cards'
import ReadingProgress from '@/components/motion/ReadingProgress'
import Picture from '@/components/Picture'
import RichText from '@/components/RichText'
import { FlowLink, FrenchNotice, PageHeader } from '@/components/ui'
import { redirect } from '@/i18n/navigation'
import { formatDate, plain } from '@/lib/format'
import { absolute, buildMetadata } from '@/lib/seo'
import { getPost, getPosts, getTranslations as getDocTranslations } from '@/sanity/lib/content'
import { imageUrl } from '@/sanity/lib/image'

export const revalidate = 60

export async function generateStaticParams({ params }) {
  return (await getPosts(params.locale)).map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params
  const post = await getPost(locale, slug)
  if (!post) return {}
  const tr = await getDocTranslations(post)
  const paths = Object.fromEntries(Object.entries(tr).map(([l, s]) => [l, `/actualites/${s}`]))
  return buildMetadata({ locale, canonicalLocale: post.language, path: `/actualites/${slug}`, paths, title: post.title, description: post.excerpt, type: 'article', image: imageUrl(post.cover, { width: 1200, height: 630 }) })
}

export default async function PostPage({ params }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const post = await getPost(locale, slug)
  if (!post) notFound()
  const tr = await getDocTranslations(post)
  if (post.language !== locale && tr[locale] && tr[locale] !== slug) redirect({ href: `/actualites/${tr[locale]}`, locale })
  const t = await getTranslations({ locale })
  const foreign = post.language !== locale ? post.language : undefined
  const jsonLd = { '@context': 'https://schema.org', '@type': 'NewsArticle', headline: plain(post.title), datePublished: post.publishedAt, inLanguage: post.language, url: absolute(locale, `/actualites/${slug}`), publisher: { '@type': 'Organization', name: 'AMEPA' } }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <ReadingProgress />
      <PageHeader title={post.title} intro={post.excerpt} lang={foreign} crumbs={[{ href: '/actualites', label: t('nav.news') }]}>
        <time dateTime={post.publishedAt} className="text-mist">{formatDate(post.publishedAt, locale)}</time>
      </PageHeader>
      <article className="shell band">
        <FrenchNotice show={foreign} />
        <ViewTransition name={`cover-${post._id}`} share="morph" default="none">
          <div className="mb-12"><Picture image={post.cover} icon={artFor(post.slug)} ratio={[21, 9]} width={1400} sizes="(min-width: 1280px) 76rem, 100vw" showCredit priority /></div>
        </ViewTransition>
        <RichText value={post.body} lang={foreign} className="mx-auto text-lg" />
        <p className="mx-auto mt-12 max-w-[44rem]"><FlowLink href="/actualites">{t('news.back')}</FlowLink></p>
      </article>
    </>
  )
}
