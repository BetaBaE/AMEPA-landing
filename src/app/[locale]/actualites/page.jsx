import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PostCard } from '@/components/cards'
import { RevealGroup } from '@/components/motion/Reveal'
import { Empty, PageHeader } from '@/components/ui'
import { buildMetadata } from '@/lib/seo'
import { getPosts } from '@/sanity/lib/content'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'news' })
  return buildMetadata({ locale, path: '/actualites', title: t('title'), description: t('intro') })
}

export default async function NewsPage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'news' })
  const posts = await getPosts(locale)
  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} />
      <div className="shell py-12 md:py-16">
        {posts.length ? <RevealGroup className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{posts.map((p) => <PostCard key={p._id} post={p} headingLevel="h2" />)}</RevealGroup> : <Empty>{t('empty')}</Empty>}
      </div>
    </>
  )
}
