import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { formatSize, safeHref } from '@/lib/format'
import Accordion from './motion/Accordion'
import FlowTimeline from './motion/FlowTimeline'
import RichText from './RichText'
import { Arrow, T } from './ui'

const Shell = ({ section, children }) => (
  <section id={section.anchor} aria-labelledby={`h-${section._key}`} className="grid gap-x-12 gap-y-6 border-t border-sand-line py-12 first:border-t-0 md:py-16 lg:grid-cols-[17rem_1fr]">
    <h2 id={`h-${section._key}`} className="text-(length:--text-section)"><T>{section.title}</T></h2>
    <div>{children}</div>
  </section>
)

function Timeline({ section }) {
  return (
    <Shell section={section}>
      <FlowTimeline items={section.items} />
    </Shell>
  )
}

function ListSection({ section }) {
  return (
    <Shell section={section}>
      {section.intro && <p className="mb-6 max-w-2xl"><T>{section.intro}</T></p>}
      <ul className={`grid gap-x-10 gap-y-8 ${section.items?.length > 1 ? 'sm:grid-cols-2' : ''}`}>
        {section.items?.map((item) => {
          const href = safeHref(item.link)
          return (
            <li key={item._key} className="border-t-2 border-ocean pt-4">
              <h3 className="text-xl">
                {href ? (href.startsWith('/')
                  ? <Link href={href} className="inline-flex items-center gap-2 underline-offset-4 hover:underline"><T>{item.title}</T><Arrow /></Link>
                  : <a href={href} rel="noopener noreferrer" className="inline-flex items-center gap-2 underline-offset-4 hover:underline"><T>{item.title}</T><Arrow /></a>) : <T>{item.title}</T>}
              </h3>
              {item.text && <p className="mt-2 text-muted"><T>{item.text}</T></p>}
            </li>
          )
        })}
      </ul>
    </Shell>
  )
}

function Documents({ section }) {
  const t = useTranslations('resources')
  const locale = useLocale()
  return (
    <Shell section={section}>
      <ul>
        {section.items?.map((item) => (
          <li key={item._key} className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-b border-sand-line py-4 first:pt-0">
            <span className="font-semibold"><T>{item.title}</T></span>
            {item.url ? <a href={`${item.url}?dl=`} className="flow-link" aria-label={`${t('download')} : ${item.title}`}>{t('download')} <span dir="ltr" className="font-normal">{formatSize(item.size, locale)}</span></a> : <span className="text-muted">{t('pending')}</span>}
          </li>
        ))}
      </ul>
    </Shell>
  )
}

export default function Sections({ sections, lang }) {
  const locale = useLocale()
  const foreign = lang && lang !== locale
  return (
    <div lang={foreign ? lang : undefined} dir={foreign ? 'ltr' : undefined}>
      {sections?.map((s) => {
        if (s._type === 'timelineSection') return <Timeline key={s._key} section={s} />
        if (s._type === 'listSection') return <ListSection key={s._key} section={s} />
        if (s._type === 'faqSection') return <Shell key={s._key} section={s}><Accordion items={(s.items ?? []).map((q) => ({ key: q._key, title: <T>{q.question}</T>, content: <p className="max-w-2xl whitespace-pre-line text-muted"><T>{q.answer}</T></p> }))} /></Shell>
        if (s._type === 'documentsSection') return <Documents key={s._key} section={s} />
        return <Shell key={s._key} section={s}><RichText value={s.body} /></Shell>
      })}
    </div>
  )
}
