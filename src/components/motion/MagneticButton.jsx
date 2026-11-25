'use client'
import { useMotionValue, useSpring } from 'motion/react'
import { span as MotionSpan } from 'motion/react-m'
import { magnet, spring } from './tokens'
import { prefersReduced } from './useDirection'

// Attraction de 6 px au plus vers le pointeur. Souris uniquement.
export default function MagneticButton({ children, className = 'inline-flex' }) {
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const x = useSpring(px, spring)
  const y = useSpring(py, spring)

  const move = (e) => {
    if (e.pointerType !== 'mouse' || prefersReduced()) return
    const r = e.currentTarget.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width - 0.5) * 2 * magnet)
    py.set(((e.clientY - r.top) / r.height - 0.5) * 2 * magnet)
  }
  const leave = () => { px.set(0); py.set(0) }

  return <MotionSpan onPointerMove={move} onPointerLeave={leave} style={{ x, y }} className={className}>{children}</MotionSpan>
}
