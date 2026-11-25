'use client'
import { useInView, useSpring, useTransform } from 'motion/react'
import { span as MotionSpan } from 'motion/react-m'
import { useEffect, useRef } from 'react'
import { duration } from './tokens'
import { prefersReduced } from './useDirection'

// Le HTML contient déjà la valeur finale. Une année part de 30 ans plus tôt, un effectif de zéro.
export default function StatCounter({ value }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [, before = '', digits, after = ''] = /^(\D*)(\d+)(.*)$/.exec(value) ?? []
  const end = digits ? Number(digits) : null
  const count = useSpring(end ?? 0, { visualDuration: duration.count * 0.6, bounce: 0 })
  const text = useTransform(() => `${before}${Math.round(count.get())}${after}`)

  const start = end > 1900 && end < 2100 ? end - 30 : 0

  // Hors écran au chargement : la valeur de départ est posée avant d'être visible.
  useEffect(() => {
    if (end !== null && !prefersReduced() && ref.current.getBoundingClientRect().top > window.innerHeight) count.jump(start)
  }, [count, end, start])

  useEffect(() => {
    if (!inView || end === null || prefersReduced()) return
    count.jump(start)
    count.set(end)
  }, [inView, end, start, count])

  return (
    <>
      <span className="sr-only">{value}</span>
      <span ref={ref} aria-hidden="true" dir="ltr" className="tabular-nums">{end === null ? value : <MotionSpan>{text}</MotionSpan>}</span>
    </>
  )
}
