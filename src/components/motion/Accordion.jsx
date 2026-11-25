'use client'
import { ChevronDown } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { div as MotionDiv } from 'motion/react-m'
import { useId, useState } from 'react'
import { duration, ease } from './tokens'

// Le contenu fermé reste dans la page (référencement) : il est masqué et retiré du clavier.
export default function Accordion({ items, defaultOpen = -1, headingLevel: H = 'h3' }) {
  const id = useId()
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-sand-line">
      {items.map((item, i) => (
        <div key={item.key} className="border-t border-sand-line">
          <H>
            <button type="button" id={`${id}-b${i}`} aria-expanded={open === i} aria-controls={`${id}-p${i}`} onClick={() => setOpen(open === i ? -1 : i)}
              className="flex min-h-14 w-full items-center justify-between gap-6 py-3 text-start text-xl hover:text-water-ink">
              {item.title}
              <ChevronDown aria-hidden="true" className={`shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
            </button>
          </H>
          <MotionDiv id={`${id}-p${i}`} role="region" aria-labelledby={`${id}-b${i}`} inert={open !== i} initial={false} animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }} transition={{ duration: reduced ? 0 : duration.base, ease }}
            className="accordion-panel overflow-hidden"><div className="pb-7 pt-1">{item.content}</div></MotionDiv>
        </div>
      ))}
    </div>
  )
}
