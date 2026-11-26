import { Play } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ResourcesExplorer } from '@/components/explorers'
import Picture from '@/components/Picture'
import { PageHeader, T } from '@/components/ui'
import { safeHref } from '@/lib/format'
import { buildMetadata } from '@/lib/seo'
import { getDomains, getPublications, getVideos } from '@/sanity/lib/content'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'resources' })
  return buildMetadata({ locale, path: '/ressources', title: t('title'), description: t('intro') })
}

export default async function ResourcesPage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale })
  const [publications, domains, videos] = await Promise.all([getPublications(locale), getDomains(locale), getVideos(locale)])
  return (
    <>
      <PageHeader title={t('resources.title')} intro={t('resources.intro')} />
      <section aria-labelledby="bibliotheque" className="shell py-12 md:py-16">
        <h2 id="bibliotheque" className="mb-8 text-(length:--text-section)">{t('resources.library')}</h2>
        <ResourcesExplorer publications={publications} domains={domains.map(({ slug, title }) => ({ slug, title }))} />
      </section>
      <section aria-labelledby="videos" className="bg-sand">
        <div className="shell py-12 md:py-16">
          <h2 id="videos" className="mb-8 text-(length:--text-section)">{t('resources.videos')}</h2>
          {videos.length ? (
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {videos.filter((v) => safeHref(v.url)).map((v) => (
                <li key={v._id} className="relative">
                  <Picture image={v.cover} icon="Waves" ratio={[16, 9]} width={800} sizes="(min-width: 1024px) 33vw, 100vw" />
                  <h3 className="mt-3 text-lg"><a href={v.url} rel="noopener noreferrer" className="flex items-center gap-2 after:absolute after:inset-0"><Play size={18} aria-hidden="true" className="shrink-0" /><span><span className="sr-only">{t('resources.watch')} : </span><T>{v.title}</T></span></a></h3>
                </li>
              ))}
            </ul>
          ) : <p className="text-muted">{t('resources.videosEmpty')}</p>}
        </div>
      </section>
    </>
  )
}
