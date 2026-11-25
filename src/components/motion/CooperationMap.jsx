'use client'
import { AnimatePresence, useInView, useReducedMotion } from 'motion/react'
import { div as MotionDiv, path as MotionPath } from 'motion/react-m'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { africaDots, moroccoDots, moroccoOutline, rabat, viewBox } from '../africaMapData'
import { countryPoints } from '../countryPoints'
import { duration, ease, stagger } from './tokens'

const [, , W, H] = viewBox.split(' ').map(Number)
const pct = (n, total) => `${((n / total) * 100).toFixed(2)}%`

function arc([x, y]) {
  const [x0, y0] = rabat
  const lift = Math.hypot(x - x0, y - y0) * 0.22
  return `M${x0} ${y0}Q${((x0 + x) / 2 + lift).toFixed(1)} ${((y0 + y) / 2 - lift).toFixed(1)} ${x} ${y}`
}

// Tracé du Maroc selon la représentation officielle marocaine (provinces du Sud incluses).
// Les arcs n'apparaissent que pour les pays saisis dans le Studio.
export default function CooperationMap({ countries = [], className = '' }) {
  const t = useTranslations('international')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduced = useReducedMotion()
  const [active, setActive] = useState(null)
  const list = countries.filter((c) => countryPoints[c.code]).map((c) => ({ ...c, point: countryPoints[c.code] }))

  return (
    <div ref={ref} dir="ltr" className={`relative ${className}`}>
      <svg role="img" aria-label={t('mapLabel')} viewBox={viewBox} className="block h-auto w-full overflow-visible" fill="none" strokeLinecap="round">
        <path d={africaDots} stroke="#4a7198" strokeWidth="5" />
        <path d={moroccoOutline} fill="#2ec4b6" fillOpacity=".16" stroke="#2ec4b6" strokeWidth="1.5" strokeLinejoin="round" />
        <path d={moroccoDots} stroke="#2ec4b6" strokeWidth="6.5" />
        {list.map((c, i) => (
          <MotionPath key={c.code} d={arc(c.point)} className="map-arc" stroke={active === c.code ? '#ffffff' : '#2ec4b6'} strokeWidth="2" initial={false} animate={{ pathLength: inView ? 1 : 0 }} transition={reduced ? { duration: 0 } : { duration: duration.slow, ease, delay: i * stagger * 2 }} />
        ))}
      </svg>
      {list.length > 0 && (
        <ul>
          {list.map((c) => {
            const [x, y] = c.point
            const name = c.name
            return (
              <li key={c.code} className="absolute size-0" style={{ insetInlineStart: pct(x, W), top: pct(y, H) }}>
                <button type="button" aria-describedby={active === c.code ? `map-${c.code}` : undefined} aria-label={name}
                  onPointerEnter={() => setActive(c.code)} onPointerLeave={() => setActive(null)} onFocus={() => setActive(c.code)} onBlur={() => setActive(null)} onClick={() => setActive(c.code)} onKeyDown={(e) => e.key === 'Escape' && setActive(null)}
                  className="group grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full">
                  <span className="size-3 rounded-full border-2 border-aqua bg-ocean transition-transform duration-200 group-hover:scale-150 group-focus-visible:scale-150" />
                </button>
                <AnimatePresence>
                  {active === c.code && (
                    <MotionDiv id={`map-${c.code}`} role="tooltip" dir="auto" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: duration.fast, ease }}
                      className={`pointer-events-none absolute z-10 w-52 bg-white p-4 text-start text-ink shadow-lg ${x > W / 2 ? 'end-4' : 'start-4'} ${y > H * 0.7 ? 'bottom-4' : 'top-4'}`}>
                      <p className="font-display font-semibold">{name}</p>
                      {c.description && <p className="mt-1 text-[0.9375rem] text-muted">{c.description}</p>}
                    </MotionDiv>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
