'use client'
import { useMotionValue, useSpring } from 'motion/react'
import { span as MotionSpan } from 'motion/react-m'
import { Link } from '@/i18n/navigation'
import DomainArt from '../DomainArt'
import DomainIcon from '../DomainIcon'
import { Arrow, T } from '../ui'
import { spring } from './tokens'

// Halo qui suit le pointeur : valeurs de mouvement, sans nouveau rendu. Au clavier, il se centre.
export default function DomainCard({ domain, headingLevel: H = 'h3' }) {
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const x = useSpring(px, spring)
  const y = useSpring(py, spring)

  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    px.set(e.clientX - r.left)
    py.set(e.clientY - r.top)
  }
  const enter = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    px.jump(e.clientX - r.left); py.jump(e.clientY - r.top)
    x.jump(e.clientX - r.left); y.jump(e.clientY - r.top)
  }
  const center = (e) => {
    if (e.currentTarget.matches(':hover')) return
    px.jump(e.currentTarget.offsetWidth / 2); py.jump(e.currentTarget.offsetHeight / 2)
    x.jump(e.currentTarget.offsetWidth / 2); y.jump(e.currentTarget.offsetHeight / 2)
  }

  return (
    <article onPointerEnter={enter} onPointerMove={move} onFocus={center} className="domain-card group relative flex flex-col overflow-hidden bg-white">
      <MotionSpan aria-hidden="true" style={{ x, y }} className="domain-spot" />
      <div className="relative flex items-start justify-between gap-4 px-6 pt-6">
        <span className="font-display text-2xl font-semibold tabular-nums text-water-ink">{domain.order}</span>
        <span className="domain-icon"><DomainIcon name={domain.icon} /></span>
      </div>
      <DomainArt icon={domain.icon} className="relative mx-6 my-5 h-auto w-auto text-[#8aa0b5] [--art-bg:white]" />
      <div className="mt-auto flex items-end justify-between gap-4 px-6 pb-6">
        <H className="text-xl"><Link href={`/expertise/${domain.slug}`} className='after:absolute after:inset-0 after:content-[""]'><T>{domain.title}</T></Link></H>
        <span className="nudge"><Arrow /></span>
      </div>
    </article>
  )
}
