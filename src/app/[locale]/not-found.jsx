import { useTranslations } from 'next-intl'
import LeakArt from '@/components/LeakArt'
import { Arrow } from '@/components/ui'
import { Link } from '@/i18n/navigation'

const LINKS = [
  ['/expertise', 'expertise'],
  ['/actualites', 'news'],
  ['/evenements', 'events'],
  ['/contact', 'contact'],
]

export default function NotFound() {
  const t = useTranslations('notFound')
  const nav = useTranslations('nav')
  return (
    <section data-dark="" className="zellige on-ocean under-header relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden bg-ocean text-white">
      <div className="shell grid items-center gap-10 py-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="lg:order-2">
          <p className="leak-code" aria-hidden="true" dir="ltr">404</p>
          <LeakArt className="-mt-10 w-full max-w-xl md:-mt-16" />
        </div>
        <div>
          <p className="rise text-sm font-semibold uppercase tracking-[0.14em] text-aqua">{t('eyebrow')}</p>
          <h1 className="rise mt-4 text-(length:--text-title)" style={{ '--i': 1 }}>{t('title')}</h1>
          <p className="rise mt-5 max-w-xl text-lg text-mist" style={{ '--i': 2 }}>{t('text')}</p>
          <div className="rise mt-8" style={{ '--i': 3 }}>
            <Link href="/" className="btn btn-aqua">{t('home')}</Link>
          </div>
          <nav aria-label={t('explore')} className="rise mt-12 border-t border-ocean-line pt-6" style={{ '--i': 4 }}>
            <p className="text-sm text-mist">{t('explore')}</p>
            <ul className="mt-3 grid gap-x-8 sm:grid-cols-2">
              {LINKS.map(([href, key]) => (
                <li key={href}>
                  <Link href={href} className="group flex items-center justify-between gap-3 border-b border-ocean-line py-3 font-semibold transition-colors hover:text-aqua">
                    {nav(key)}<span className="nudge-link"><Arrow /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  )
}
