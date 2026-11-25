'use client'
import { X } from 'lucide-react'
import { AnimatePresence, stagger as staggerChildren } from 'motion/react'
import { div as MotionDiv, li as MotionLi, ul as MotionUl } from 'motion/react-m'
import { useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import Wordmark from '../Wordmark'
import { duration, ease, stagger } from './tokens'
import { useDirection } from './useDirection'

const list = { closed: {}, open: { transition: { delayChildren: staggerChildren(stagger / 2, { startDelay: duration.fast }) } } }
const item = { closed: { opacity: 0, y: 16 }, open: { opacity: 1, y: 0 } }

function Panel({ label, closeLabel, links, cta, isCurrent, onClose }) {
  const dir = useDirection()
  const ref = useRef(null)

  useEffect(() => {
    const opener = document.activeElement
    ref.current?.querySelector('button')?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      opener?.focus?.({ preventScroll: true })
    }
  }, [])

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key !== 'Tab') return
    const f = [...ref.current.querySelectorAll('a[href], button')]
    const edge = e.shiftKey ? f[0] : f[f.length - 1]
    if (document.activeElement !== edge) return
    e.preventDefault()
    ;(e.shiftKey ? f[f.length - 1] : f[0]).focus()
  }

  return (
    <MotionDiv ref={ref} id="menu-mobile" role="dialog" aria-modal="true" aria-label={label} onKeyDown={onKeyDown}
      initial={{ x: dir > 0 ? '100%' : '-100%' }} animate={{ x: 0 }} exit={{ x: dir > 0 ? '100%' : '-100%' }} transition={{ duration: duration.base, ease }}
      className="fixed inset-0 z-[70] overflow-y-auto bg-ocean text-white nav:hidden">
      <div className="shell flex h-(--header) items-center justify-between">
        <Wordmark light />
        <button type="button" onClick={onClose} aria-label={closeLabel} className="grid size-12 place-items-center rounded-sm border-[1.5px] border-white"><X aria-hidden="true" /></button>
      </div>
      <nav aria-label={label} className="shell py-6">
        <MotionUl initial="closed" animate="open" variants={list}>
          {links.map(([text, href]) => (
            <MotionLi key={href} variants={item} className="border-b border-ocean-line">
              <Link href={href} onClick={onClose} aria-current={isCurrent(href) ? 'page' : undefined} className="block py-3.5 font-display text-xl font-semibold aria-[current=page]:text-aqua">{text}</Link>
            </MotionLi>
          ))}
        </MotionUl>
        <Link href={cta[1]} onClick={onClose} className="btn btn-aqua mt-6 w-full">{cta[0]}</Link>
      </nav>
    </MotionDiv>
  )
}

export default function MobileSheet({ open, ...props }) {
  return <AnimatePresence>{open && <Panel key="sheet" {...props} />}</AnimatePresence>
}
