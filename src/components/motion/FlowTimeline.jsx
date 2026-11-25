'use client'
import { useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { span as MotionSpan } from 'motion/react-m'
import { useRef } from 'react'
import { T } from '../ui'
import { Reveal } from './Reveal'
import { spring } from './tokens'

// La conduite se remplit au défilement ; chaque jalon réagit une fois à son passage.
export default function FlowTimeline({ items = [] }) {
  const ref = useRef(null)
  const nodes = useRef([])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, spring)

  useMotionValueEvent(fill, 'change', (v) => {
    const list = ref.current
    if (!list) return
    const level = v * list.offsetHeight
    for (const n of nodes.current) if (n && n.parentElement.offsetTop + n.offsetTop <= level) n.dataset.reached = 'true'
  })

  return (
    <div ref={ref} className="relative">
      <span aria-hidden="true" className="absolute inset-y-0 start-0 w-[3px] rounded-full bg-sand-line" />
      <MotionSpan aria-hidden="true" style={{ scaleY: fill }} className="pipe-fill absolute inset-y-0 start-0 w-[3px] origin-top rounded-full bg-aqua" />
      <ol>
        {items.map((item, i) => (
          <li key={item._key} className="relative pb-10 ps-8 last:pb-0">
            <span ref={(n) => { nodes.current[i] = n }} aria-hidden="true" className="pipe-node absolute -start-[0.4rem] top-2 size-4 rounded-full border-[3px] border-aqua bg-white" />
            <Reveal side className="grid gap-x-8 gap-y-1 sm:grid-cols-[6rem_1fr]">
              <span className="font-display text-2xl font-semibold tabular-nums text-water-ink">{item.year}</span>
              <div><h3 className="pt-1 text-xl"><T>{item.title}</T></h3><p className="mt-1.5 max-w-xl text-muted"><T>{item.text}</T></p></div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  )
}
