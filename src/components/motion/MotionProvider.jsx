'use client'
import { LazyMotion, MotionConfig } from 'motion/react'
import { duration, ease } from './tokens'

const loadFeatures = () => import('./features').then((m) => m.default)

export default function MotionProvider({ children }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: duration.base, ease }}>{children}</MotionConfig>
    </LazyMotion>
  )
}
