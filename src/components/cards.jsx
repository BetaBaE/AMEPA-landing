import { Download, Lock, MapPin } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { ViewTransition } from 'react'
import { Link } from '@/i18n/navigation'
import { formatDate, formatEventDate, formatSize, isTbc, safeHref } from '@/lib/format'
import { hasImage, imageUrl } from '@/sanity/lib/image'
import Picture from './Picture'
import { Arrow, FrenchTag, T } from './ui'

// Le titre porte le lien ; ::after étend la zone cliquable à toute la carte.
const cover = 'after:absolute after:inset-0 after:content-[""]'

// Sans photo, chaque article garde toujours le même schéma.
const ARTS = ['Factory', 'Waves', 'Droplets', 'Cpu', 'Recycle', 'Gauge']
export const artFor = (slug = '') => ARTS[[...slug].reduce((n, c) => n + c.charCodeAt(0), 0) % ARTS.length]

export function PostCard({ post, lead = false, headingLevel: H = 'h3' }) {
  const locale = useLocale()
  return (
    <article className="group relative">
      <ViewTransition name={`cover-${post._id}`} share="morph" default="none">
        <div><Picture image={post.cover} icon={artFor(post.slug)} ratio={lead ? [16, 9] : [16, 10]} width={lead ? 1200 : 800} sizes={lead ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 768px) 33vw, 100vw'} /></div>
      </ViewTransition>
      <p className="mt-5 flex flex-wrap items-center gap-3 text-[0.9375rem] text-muted">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time><FrenchTag doc={post} locale={locale} />
      </p>
      <H className={`mt-2 ${lead ? 'text-2xl md:text-[1.75rem]' : 'text-xl'}`}>
        <Link href={`/actualites/${post.slug}`} className={`${cover} decoration-aqua decoration-2 underline-offset-4 group-hover:underline`} lang={post.language}><T>{post.title}</T></Link>
      </H>
      {post.excerpt && <p className="mt-2 text-muted" lang={post.language}><T>{post.excerpt}</T></p>}
    </article>
  )
}

export function EventRow({ event, headingLevel: H = 'h3' }) {
  const locale = useLocale()
  const t = useTranslations('events')
  const day = !event.dateTbc && !event.monthOnly && event.startDate
  return (
    <article className="group relative grid gap-x-8 gap-y-2 border-t border-sand-line py-7 transition-colors hover:bg-sand/60 sm:grid-cols-[9.5rem_1fr_auto] sm:items-start">
      <p className="font-display leading-tight">
        {day ? (
          <time dateTime={event.startDate} className="flex items-baseline gap-2 sm:block">
            <span className="text-4xl font-semibold tabular-nums text-ocean sm:block">{formatDate(event.startDate, locale, { day: 'numeric' })}</span>
            <span className="text-muted">{formatDate(event.startDate, locale, { month: 'long', year: 'numeric' })}</span>
          </time>
        ) : <span className="block text-lg font-semibold text-muted first-letter:uppercase">{formatEventDate(event, locale, t('dateTbc'))}</span>}
      </p>
      <div>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.9375rem]">
          {event.type && <span className="font-semibold text-water-ink">{t(`types.${event.type}`)}</span>}
          {event.location && !isTbc(event.location) && <span className="inline-flex items-center gap-1.5 text-muted"><MapPin size={16} aria-hidden="true" />{event.location}</span>}
          <FrenchTag doc={event} locale={locale} />
        </p>
        <H className="mt-1 text-[1.375rem]"><Link href={`/evenements/${event.slug}`} className={cover} lang={event.language}><T>{event.title}</T></Link></H>
        {hasImage(event.cover) && <ViewTransition name={`cover-${event._id}`} share="morph" default="none"><div className="mt-4 max-w-sm"><Picture image={event.cover} width={800} sizes="24rem" /></div></ViewTransition>}
        {event.summary && <p className="mt-2 max-w-2xl text-muted" lang={event.language}><T>{event.summary}</T></p>}
      </div>
      <span className="hidden self-center text-water-ink transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 sm:block"><Arrow size={22} /></span>
    </article>
  )
}

export function PublicationRow({ publication: p, headingLevel: H = 'h3' }) {
  const locale = useLocale()
  const t = useTranslations('resources')
  return (
    <article className="grid gap-x-8 gap-y-3 border-t border-sand-line py-6 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.9375rem]">
          {p.kind && <span className="font-semibold text-water-ink">{t(`kinds.${p.kind}`)}</span>}
          {p.date && <time dateTime={p.date} className="text-muted">{formatDate(p.date, locale, { month: 'long', year: 'numeric' })}</time>}
          <FrenchTag doc={p} locale={locale} />
        </p>
        <H className="mt-1 text-xl" lang={p.language}><T>{p.title}</T></H>
        {p.summary && <p className="mt-1.5 max-w-2xl text-muted" lang={p.language}><T>{p.summary}</T></p>}
      </div>
      {p.membersOnly ? (
        <span className="inline-flex items-center gap-2 text-muted"><Lock size={17} aria-hidden="true" />{t('membersOnly')}</span>
      ) : p.fileUrl ? (
        <a href={`${p.fileUrl}?dl=`} className="btn btn-line text-ocean hover:bg-sand" aria-label={`${t('download')} : ${p.title}`}>
          <Download size={18} aria-hidden="true" />{t('download')}{p.fileSize ? <span className="font-normal" dir="ltr">{formatSize(p.fileSize, locale)}</span> : null}
        </a>
      ) : <span className="text-muted">{t('pending')}</span>}
    </article>
  )
}

export function MemberCard({ member: m, headingLevel: H = 'h2' }) {
  const t = useTranslations('members')
  const href = safeHref(m.website)
  return (
    <article className="flex flex-col bg-white p-6">
      <div className="flex h-16 items-center">
        {hasImage(m.logo)
          ? <Image src={imageUrl(m.logo, { width: 320, fit: 'max' })} alt="" width={160} height={64} className="max-h-16 w-auto object-contain" />
          : <span aria-hidden="true" className="grid size-14 place-items-center bg-sand font-display text-xl font-semibold text-ocean">{m.name.replace(/\[.*\]/, '').trim().charAt(0)}</span>}
      </div>
      <H className="mt-4 text-lg"><T>{m.name}</T></H>
      <p className="mt-1 text-[0.9375rem] text-muted">{[m.category && t(`categories.${m.category}`), !isTbc(m.city) && m.city].filter(Boolean).join(' · ')}</p>
      {m.description && <p className="mt-3 text-[0.9375rem]">{m.description}</p>}
      {href && <p className="mt-auto pt-4"><a href={href} rel="noopener noreferrer" className="flow-link text-[0.9375rem]" aria-label={`${t('website')} : ${m.name}`}>{t('website')}<Arrow size={15} /></a></p>}
    </article>
  )
}
