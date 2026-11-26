'use client'
import { useTranslations } from 'next-intl'
import WaterDrop from '@/components/motion/WaterDrop'

// Affiché pendant le passage d'une page à l'autre, le temps que la suivante arrive.
// Même bandeau que l'en-tête des pages : rien ne saute à l'arrivée du contenu.
export default function Loading() {
  const t = useTranslations('common')
  return (
    <div className="page-loading">
      <header data-dark="" className="zellige under-header bg-ocean text-white">
        <div className="shell flex items-center gap-6 pb-16 pt-8 md:pb-20 md:pt-10">
          <WaterDrop loop className="w-12 shrink-0 md:w-14" />
          <div className="min-w-0 flex-1">
            <p role="status" className="text-sm font-semibold uppercase tracking-[0.14em] text-aqua">{t('loading')}</p>
            <div className="skeleton skeleton-dark mt-5 h-9 w-4/5 max-w-xl md:h-12" />
            <div className="skeleton skeleton-dark mt-4 h-4 w-3/5 max-w-md" />
          </div>
        </div>
        <svg className="rtl-flip block h-7 w-full text-aqua" viewBox="0 0 1440 28" preserveAspectRatio="none" aria-hidden="true">
          <path fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" d="M0 14c60 0 60-9 120-9s60 18 120 18 60-18 120-18 60 18 120 18 60-18 120-18 60 18 120 18 60-18 120-18 60 18 120 18 60-18 120-18 60 18 120 18 60-18 120-18 60 9 120 9" />
        </svg>
      </header>
      <div className="shell band grid gap-8 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className={i === 2 ? 'hidden lg:block' : i === 1 ? 'hidden sm:block' : ''}>
            <div className="skeleton aspect-[16/10] w-full" />
            <div className="skeleton mt-5 h-5 w-4/5" />
            <div className="skeleton mt-3 h-4 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  )
}
