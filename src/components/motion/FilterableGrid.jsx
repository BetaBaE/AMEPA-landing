'use client'
import { AnimatePresence, LazyMotion } from 'motion/react'
import { div as MotionDiv, span as MotionSpan } from 'motion/react-m'
import { useId } from 'react'
import { duration, ease, spring } from './tokens'

// Les animations de mise en page ne sont chargées que sur les pages à filtres.
const loadFeatures = () => import('./layoutFeatures').then((m) => m.default)

export function LayoutMotion({ children }) {
  return <LazyMotion features={loadFeatures} strict>{children}</LazyMotion>
}

export function Chips({ label, value, options, onChange, className = '' }) {
  const id = useId()
  return (
    <div className={className}>
      <p id={`${id}-l`} className="mb-1.5 text-[0.9375rem] font-semibold">{label}</p>
      <MotionDiv layoutScroll role="group" aria-labelledby={`${id}-l`} className="chips isolate flex gap-2 sm:flex-wrap">
        {options.map(([v, text]) => (
          <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)}
            className="relative min-h-11 shrink-0 rounded-full border-[1.5px] border-ocean px-4 text-[0.9375rem] font-semibold whitespace-nowrap transition-colors duration-200 hover:bg-sand aria-pressed:text-white aria-pressed:delay-100 aria-pressed:hover:bg-transparent">
            {value === v && <MotionSpan aria-hidden="true" layoutId={`chip-indicator-${id}`} transition={spring} className="absolute -inset-[1.5px] -z-10 rounded-full bg-ocean" />}
            {text}
          </button>
        ))}
      </MotionDiv>
    </div>
  )
}

const t = { duration: duration.grid, ease }

export default function FilterableGrid({ items, render, empty, className, itemClassName }) {
  return (
    <div className="relative">
      <div className={`relative ${items.length ? className : ''}`}>
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item) => (
            <MotionDiv key={item._id} layout={items.length <= 48 ? 'position' : false} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96, transition: { duration: duration.fast } }}
              transition={t} className={itemClassName}>{render(item)}</MotionDiv>
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence initial={false}>
        {!items.length && <MotionDiv key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} transition={t}>{empty}</MotionDiv>}
      </AnimatePresence>
    </div>
  )
}
