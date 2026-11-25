'use client'
import { useInView } from 'motion/react'
import { useRef } from 'react'

const wave = (y, a, l) => {
  let d = `M-200 ${y}`
  for (let x = -200, s = 1; x < 1900; x += l, s = -s) d += `q${l / 2} ${-a * s} ${l} 0`
  return d
}
const WAVES = [
  { d: wave(90, 34, 300), color: '#0e7cc2', width: 2, opacity: 0.5 },
  { d: wave(150, 26, 240), color: '#2ec4b6', width: 1.5, opacity: 0.32 },
  { d: wave(205, 40, 400), color: '#4a90c2', width: 1.5, opacity: 0.3 },
]

// Décor du hero, en CSS : trois lignes d'eau et un halo localisé. En pause hors écran.
export default function HeroWaves() {
  const ref = useRef(null)
  const inView = useInView(ref, { initial: true })
  return (
    <div ref={ref} aria-hidden="true" data-paused={!inView} className="hero-waves pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <span className="hero-halo" />
      {WAVES.map((w, i) => (
        <svg key={w.color} viewBox="0 0 1600 260" preserveAspectRatio="none" className="hero-drift absolute inset-x-0 top-[12%] h-[44%] w-full overflow-visible" style={{ '--i': i }} fill="none">
          <path pathLength="1" className="hero-wave" style={{ '--i': i }} d={w.d} stroke={w.color} strokeWidth={w.width} strokeOpacity={w.opacity} />
        </svg>
      ))}
    </div>
  )
}
