'use client'
import { useScroll, useSpring } from 'motion/react'
import { span as MotionSpan } from 'motion/react-m'
import { spring } from './tokens'

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, spring)
  return <MotionSpan aria-hidden="true" style={{ scaleX }} className="reading-progress fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-aqua rtl:origin-right" />
}
