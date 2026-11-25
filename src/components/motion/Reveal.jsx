'use client'
import { div as MotionDiv } from 'motion/react-m'
import { Children, useEffect, useRef, useState } from 'react'
import { duration, ease, reveal, stagger } from './tokens'
import { prefersReduced, useDirection } from './useDirection'

const variants = {
  hidden: ({ x }) => ({ opacity: 0, x, y: x ? 0 : reveal.y, transition: { duration: 0 } }),
  visible: ({ delay }) => ({ opacity: 1, x: 0, y: 0, transition: { duration: duration.base, ease, delay } }),
}

// Le HTML du serveur est visible. Seul un bloc situé sous l'écran est masqué, puis révélé une fois.
// `side` : arrivée par le côté de fin de ligne (inversée en arabe) au lieu du bas.
export function Reveal({ children, side = false, ...props }) {
  const ref = useRef(null)
  const dir = useDirection()
  const [state, setState] = useState({ name: 'visible', delay: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    const io = new IntersectionObserver(([entry]) => {
      const { boundingClientRect: box, intersectionRatio, intersectionRect } = entry
      if (box.top >= window.innerHeight) {
        setState({ name: 'hidden', delay: 0 })
        return
      }
      // Un bloc plus haut que l'écran n'atteint jamais 30 % : 30 % de l'écran suffit.
      const enough = intersectionRatio >= reveal.amount || intersectionRect.height >= window.innerHeight * reveal.amount || box.bottom < 0
      if (!enough) return
      const row = [...el.parentElement.children].filter((n) => n.dataset.reveal !== undefined && n.offsetTop === el.offsetTop)
      setState({ name: 'visible', delay: Math.max(0, row.indexOf(el)) * stagger })
      io.disconnect()
    }, { threshold: [0, 0.1, 0.2, reveal.amount, 0.5] })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <MotionDiv ref={ref} data-reveal="" initial={false} animate={state.name} custom={{ delay: state.delay, x: side ? reveal.x * dir : 0 }} variants={variants} {...props}>{children}</MotionDiv>
  )
}

export function RevealGroup({ itemClassName, children, ...props }) {
  return <div {...props}>{Children.map(children, (child) => child && <Reveal className={itemClassName}>{child}</Reveal>)}</div>
}
