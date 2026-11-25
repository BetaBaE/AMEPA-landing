import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { TBC_TOKEN } from '@/lib/format'
import { Reveal } from './motion/Reveal'

// Affiche un texte en signalant visuellement chaque [À CONFIRMER].
export function T({ children }) {
  const t = useTranslations('meta')
  const text = children ?? ''
  if (typeof text !== 'string' || !text.includes(TBC_TOKEN)) return text
  return text.split(TBC_TOKEN).flatMap((part, i) => (i === 0 ? [part] : [<span key={i} className="tbc">{t('tbc')}</span>, part]))
}

export const Arrow = ({ size = 18 }) => <ArrowRight size={size} aria-hidden="true" className="rtl-flip shrink-0" />

export function FlowLink({ href, children, ...props }) {
  return <Link href={href} className="flow-link" {...props}>{children}<Arrow size={16} /></Link>
}

export function SectionHead({ id, title, intro, link }) {
  return (
    <Reveal className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h2 id={id} className="text-(length:--text-section)">{title}</h2>
        {intro && <p className="mt-3 opacity-80"><T>{intro}</T></p>}
      </div>
      {link && <div className="shrink-0"><FlowLink href={link.href}>{link.label}</FlowLink></div>}
    </Reveal>
  )
}

export function Empty({ children, action }) {
  return (
    <div className="border-y border-sand-line py-10">
      <p className="max-w-xl text-muted">{children}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function PageHeader({ title, intro, crumbs = [], children, lang }) {
  const t = useTranslations('nav')
  return (
    <header data-dark="" className="zellige on-ocean under-header bg-ocean text-white">
      <div className="shell pb-16 pt-8 md:pb-20 md:pt-10">
        <nav aria-label={t('breadcrumb')} className="text-[0.9375rem] text-mist">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li><Link href="/" className="inline-block py-1 underline-offset-4 hover:underline">{t('home')}</Link></li>
            {crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-x-2">
                <span aria-hidden="true">/</span>
                <Link href={c.href} className="inline-block py-1 underline-offset-4 hover:underline">{c.label}</Link>
              </li>
            ))}
          </ol>
        </nav>
        <h1 lang={lang} dir={lang === 'fr' ? 'ltr' : undefined} className="rise mt-6 max-w-4xl text-(length:--text-title)"><T>{title}</T></h1>
        {intro && <p className="rise mt-5 max-w-2xl text-lg text-mist" style={{ '--i': 1 }}><T>{intro}</T></p>}
        {children && <div className="rise mt-8" style={{ '--i': 2 }}>{children}</div>}
      </div>
      <WaveEdge />
    </header>
  )
}

// Ligne d'eau en bas des bandeaux.
export function WaveEdge() {
  return (
    <svg className="rtl-flip wave-edge block h-7 w-full text-aqua" viewBox="0 0 1440 28" preserveAspectRatio="none" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke"
        d="M0 14c60 0 60-9 120-9s60 18 120 18 60-18 120-18 60 18 120 18 60-18 120-18 60 18 120 18 60-18 120-18 60 18 120 18 60-18 120-18 60 18 120 18 60-18 120-18 60 9 120 9" />
    </svg>
  )
}

export function FrenchNotice({ show }) {
  const t = useTranslations('common')
  if (!show) return null
  return <p className="mb-8 border-s-4 border-aqua bg-sand px-5 py-3">{t('onlyFrench')}</p>
}

export function FrenchTag({ doc, locale }) {
  const t = useTranslations('common')
  if (!doc.language || doc.language === locale) return null
  return <span className="rounded-sm bg-sand px-2 py-0.5 text-sm text-muted">{t('inFrench')}</span>
}
