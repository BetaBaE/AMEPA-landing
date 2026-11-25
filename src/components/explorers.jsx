'use client'
import { Search } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useId } from 'react'
import { fold, formatDate, safeHref } from '@/lib/format'
import { useQuery } from '@/lib/useQuery'
import { EventRow, MemberCard, PublicationRow } from './cards'
import EventCalendar from './EventCalendar'
import FilterableGrid, { Chips, LayoutMotion } from './motion/FilterableGrid'
import { Arrow, Empty, FrenchTag, T } from './ui'

function SelectFilter({ label, all, value, onChange, options }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.9375rem] font-semibold">{label}</label>
      <select id={id} className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{all}</option>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  )
}

function SearchFilter({ label, value, onChange }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.9375rem] font-semibold">{label}</label>
      <div className="relative">
        <Search size={19} aria-hidden="true" className="absolute inset-y-0 start-3.5 my-auto text-muted" />
        <input id={id} type="search" className="field ps-11" defaultValue={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  )
}

const Bar = ({ children, label }) => <div role="group" aria-label={label} className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
const Full = 'sm:col-span-2 lg:col-span-3'

export function EventsExplorer({ events, domains, now }) {
  const t = useTranslations('events')
  const tc = useTranslations('common')
  const tm = useTranslations('members')
  const { get, set, reset } = useQuery()
  const period = get('periode') === 'archives' ? 'archives' : 'avenir'
  const view = get('vue') === 'calendrier' ? 'calendrier' : 'liste'
  const type = get('type')
  const domain = get('domaine')
  const types = [...new Set(events.map((e) => e.type).filter(Boolean))]
  const matching = events.filter((e) => (!type || e.type === type) && (!domain || e.domains?.includes(domain)))
  const shown = matching.filter((e) => e.past === (period === 'archives'))
  if (period === 'archives') shown.reverse()

  return (
    <LayoutMotion>
      <Bar label={tc('filters')}>
        <div className={`flex flex-wrap gap-x-10 gap-y-5 ${Full}`}>
          <Chips label={t('view')} value={view} options={[['liste', t('list')], ['calendrier', t('calendar')]]} onChange={(v) => set('vue', v === 'calendrier' ? v : '')} />
          {view === 'liste' && <Chips label={t('date')} value={period} options={[['avenir', t('upcoming')], ['archives', t('past')]]} onChange={(v) => set('periode', v === 'archives' ? v : '')} />}
        </div>
        <Chips className={Full} label={t('type')} value={type} options={[['', t('allTypes')], ...types.map((x) => [x, t(`types.${x}`)])]} onChange={(v) => set('type', v)} />
        <SelectFilter label={t('domain')} all={t('allDomains')} value={domain} onChange={(v) => set('domaine', v)} options={domains.map((d) => [d.slug, d.title])} />
      </Bar>
      {view === 'calendrier' ? <EventCalendar events={matching} now={now} /> : (
        <>
          <p role="status" className="mb-4 text-muted">{t('count', { count: shown.length })}</p>
          <FilterableGrid items={shown} className="border-b border-sand-line" render={(e) => <EventRow event={e} headingLevel="h2" />}
            empty={<Empty action={(type || domain) && <button type="button" className="flow-link" onClick={reset}>{tm('reset')}</button>}>{period === 'archives' ? t('emptyPast') : t('emptyUpcoming')}</Empty>} />
        </>
      )}
    </LayoutMotion>
  )
}

export function MembersExplorer({ members }) {
  const t = useTranslations('members')
  const tc = useTranslations('common')
  const { get, set, reset } = useQuery()
  const query = get('q')
  const category = get('categorie')
  const needle = fold(query)
  const shown = members.filter((m) => (!category || m.category === category) && (!needle || fold(`${m.name} ${m.city ?? ''} ${m.description ?? ''}`).includes(needle)))
  const categories = [...new Set(members.map((m) => m.category).filter(Boolean))]

  return (
    <LayoutMotion>
      <Bar label={tc('filters')}>
        <SearchFilter key={query === '' ? 'empty' : 'q'} label={t('search')} value={query} onChange={(v) => set('q', v)} />
        <Chips className={Full} label={t('category')} value={category} options={[['', t('all')], ...categories.map((c) => [c, t(`categories.${c}`)])]} onChange={(v) => set('categorie', v)} />
      </Bar>
      <p role="status" className="mb-4 text-muted">{t('count', { count: shown.length })}</p>
      <FilterableGrid items={shown} className="cells grid gap-px sm:grid-cols-2 lg:grid-cols-3" itemClassName="grid" render={(m) => <MemberCard member={m} />}
        empty={<Empty action={<button type="button" className="flow-link" onClick={reset}>{t('reset')}</button>}>{t('empty')}</Empty>} />
    </LayoutMotion>
  )
}

export function ResourcesExplorer({ publications, domains }) {
  const t = useTranslations('resources')
  const tc = useTranslations('common')
  const tm = useTranslations('members')
  const { get, set, reset } = useQuery()
  const query = get('q')
  const kind = get('type')
  const domain = get('domaine')
  const needle = fold(query)
  const shown = publications.filter((p) => (!kind || p.kind === kind) && (!domain || p.domains?.includes(domain)) && (!needle || fold(`${p.title} ${p.summary ?? ''}`).includes(needle)))
  const kinds = [...new Set(publications.map((p) => p.kind).filter(Boolean))]

  return (
    <LayoutMotion>
      <Bar label={tc('filters')}>
        <SearchFilter key={query === '' ? 'empty' : 'q'} label={t('search')} value={query} onChange={(v) => set('q', v)} />
        <SelectFilter label={t('domain')} all={t('allDomains')} value={domain} onChange={(v) => set('domaine', v)} options={domains.map((d) => [d.slug, d.title])} />
        <Chips className={Full} label={t('kind')} value={kind} options={[['', t('allKinds')], ...kinds.map((k) => [k, t(`kinds.${k}`)])]} onChange={(v) => set('type', v)} />
      </Bar>
      <p role="status" className="mb-4 text-muted">{t('count', { count: shown.length })}</p>
      <FilterableGrid items={shown} className="border-b border-sand-line" render={(p) => <PublicationRow publication={p} />}
        empty={<Empty action={<button type="button" className="flow-link" onClick={reset}>{tm('reset')}</button>}>{t('empty')}</Empty>} />
    </LayoutMotion>
  )
}

export function OpportunitiesExplorer({ opportunities }) {
  const t = useTranslations('opportunities')
  const tc = useTranslations('common')
  const locale = useLocale()
  const { get, set } = useQuery()
  const kind = get('type')
  const kinds = [...new Set(opportunities.map((o) => o.kind).filter(Boolean))]
  const shown = opportunities.filter((o) => !kind || o.kind === kind)

  return (
    <>
      {kinds.length > 1 && <Bar label={tc('filters')}><SelectFilter label={t('kind')} all={t('all')} value={kind} onChange={(v) => set('type', v)} options={kinds.map((k) => [k, t(`kinds.${k}`)])} /></Bar>}
      {shown.length ? (
        <ul className="border-b border-sand-line">
          {shown.map((o) => (
            <li key={o._id} className="grid gap-x-8 gap-y-3 border-t border-sand-line py-7 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="flex flex-wrap gap-x-4 text-[0.9375rem]"><span className="font-semibold text-water-ink">{o.kind && t(`kinds.${o.kind}`)}</span>{o.issuer && <span className="text-muted">{o.issuer}</span>}<FrenchTag doc={o} locale={locale} /></p>
                <h3 className="mt-1 text-xl" lang={o.language}><T>{o.title}</T></h3>
                {o.summary && <p className="mt-1.5 max-w-2xl text-muted" lang={o.language}><T>{o.summary}</T></p>}
                {o.deadline && <p className="mt-2 text-[0.9375rem]">{o.closed ? <strong>{t('closed')}</strong> : <>{t('deadline')} : <strong><time dateTime={o.deadline}>{formatDate(o.deadline, locale)}</time></strong></>}</p>}
              </div>
              <div className="flex flex-wrap gap-5">
                {safeHref(o.link) && <a href={o.link} rel="noopener noreferrer" className="flow-link">{t('link')}<Arrow size={16} /></a>}
                {o.fileUrl && <a href={`${o.fileUrl}?dl=`} className="flow-link">{t('file')}</a>}
              </div>
            </li>
          ))}
        </ul>
      ) : <Empty>{t('empty')}</Empty>}
    </>
  )
}
