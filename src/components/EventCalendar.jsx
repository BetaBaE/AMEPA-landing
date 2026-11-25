'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { dayKey, formatDate, plain } from '@/lib/format'
import { EventRow } from './cards'

const pad = (n) => String(n).padStart(2, '0')

// Semaine commençant le lundi dans les trois langues (usage au Maroc).
export default function EventCalendar({ events, now }) {
  const locale = useLocale()
  const t = useTranslations('events')
  const tMeta = useTranslations('meta')
  const [today] = useState(() => dayKey(now))
  const [{ y, m }, setMonth] = useState(() => ({ y: Number(today.slice(0, 4)), m: Number(today.slice(5, 7)) - 1 }))
  const move = (d) => setMonth(({ y, m }) => { const x = new Date(Date.UTC(y, m + d, 1)); return { y: x.getUTCFullYear(), m: x.getUTCMonth() } })

  const prefix = `${y}-${pad(m + 1)}`
  const first = new Date(Date.UTC(y, m, 1, 12))
  const offset = (first.getUTCDay() + 6) % 7
  const count = new Date(Date.UTC(y, m + 1, 0)).getUTCDate()
  const cells = [...Array(offset).fill(null), ...Array.from({ length: count }, (_, i) => `${prefix}-${pad(i + 1)}`)]
  while (cells.length % 7) cells.push(null)

  const dated = events.filter((e) => e.startDate && !e.dateTbc)
  const exact = dated.filter((e) => !e.monthOnly).map((e) => ({ ...e, from: dayKey(e.startDate), to: dayKey(e.endDate ?? e.startDate) }))
  const onDay = (k) => exact.filter((e) => e.from <= k && k <= e.to)
  const inMonth = [...exact.filter((e) => e.from.slice(0, 7) <= prefix && prefix <= e.to.slice(0, 7)), ...dated.filter((e) => e.monthOnly && dayKey(e.startDate).startsWith(prefix))]
  const weekdays = Array.from({ length: 7 }, (_, i) => new Date(Date.UTC(2024, 0, 1 + i, 12)))

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 aria-live="polite" className="text-2xl first-letter:uppercase">{formatDate(first, locale, { month: 'long', year: 'numeric' })}</h2>
        <div className="flex gap-2">
          {[[-1, t('prevMonth'), ChevronLeft], [1, t('nextMonth'), ChevronRight]].map(([d, label, Icon]) => (
            <button key={d} type="button" onClick={() => move(d)} aria-label={label} className="grid size-12 place-items-center border-[1.5px] border-ocean hover:bg-sand"><Icon aria-hidden="true" className="rtl-flip" /></button>
          ))}
        </div>
      </div>
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>{weekdays.map((d) => (
            <th key={d.getTime()} scope="col" className="pb-2 text-sm font-semibold text-muted">
              <span className="hidden md:inline">{formatDate(d, locale, { weekday: 'long' })}</span><span className="md:hidden">{formatDate(d, locale, { weekday: 'narrow' })}</span>
            </th>
          ))}</tr>
        </thead>
        <tbody>
          {Array.from({ length: cells.length / 7 }, (_, w) => (
            <tr key={w}>
              {cells.slice(w * 7, w * 7 + 7).map((k, i) => {
                const list = k ? onDay(k) : []
                return (
                  <td key={k ?? `x${i}`} className={`h-14 border border-sand-line p-1.5 align-top md:h-24 md:p-2 ${k ? '' : 'bg-sand/50'} ${list.length ? 'bg-[#e3f6f4]' : ''}`}>
                    {k && <span className={`inline-grid size-7 place-items-center text-sm tabular-nums ${k === today ? 'rounded-full bg-ocean font-semibold text-white' : ''}`}>{Number(k.slice(8))}</span>}
                    {list.map((e) => (
                      <Link key={e._id} href={`/evenements/${e.slug}`} className="block truncate text-sm font-semibold text-water-ink hover:underline" title={plain(e.title, tMeta('tbc'))}>
                        <span className="hidden md:inline">{plain(e.title, tMeta('tbc'))}</span>
                        <span className="mx-auto block size-2.5 rounded-full bg-water md:hidden"><span className="sr-only">{plain(e.title, tMeta('tbc'))}</span></span>
                      </Link>
                    ))}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-8">
        {inMonth.length ? inMonth.map((e) => <EventRow key={e._id} event={e} />) : <p className="text-muted">{t('count', { count: 0 })}</p>}
      </div>
    </div>
  )
}
