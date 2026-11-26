'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from '@/i18n/navigation'
import { createLiquid } from './liquid'
import { prefersReduced } from './useDirection'

const PAD = 8
const MIN = 64
// Le front d'eau mène, l'arrière suit avec plus d'inertie et un léger dépassement.
const LEAD = [460, 42]
const TRAIL = [190, 23]
// Gouttes : ressorts plus mous, qui traînent derrière la colonne et s'en détachent quand on défile vite.
const DROPS = [[58, 6.5], [30, 4.6]]
const DROP_SIZE = [0.9, 0.68]
const DROP_MAX = 64

const spring = (pos, vel, target, [k, c], dt) => {
  const v = vel + (k * (target - pos) - c * vel) * dt
  return [pos + v * dt, v]
}

// Barre de défilement : une colonne d'eau dans un tube fin, posée par-dessus la page.
// Le défilement reste celui du navigateur ; seule la barre est redessinée, et uniquement à la souris
// (voir globals.css). Dessin à la demande : plus rien ne tourne une fois l'eau au repos.
export default function WaterScrollbar() {
  const pathname = usePathname()
  const bar = useRef(null)
  const canvas = useRef(null)
  const thumb = useRef(null)
  const tag = useRef(null)
  const grab = useRef(null)
  const wake = useRef(() => {})
  const size = useRef({ max: 0, run: 1, len: MIN })
  const [marks, setMarks] = useState([])

  useEffect(() => {
    const root = bar.current
    const reduced = prefersReduced()
    const liquid = createLiquid(canvas.current)
    root.dataset.gl = Boolean(liquid)
    let points = []
    let frame = 0
    let then = 0
    let idle = 0
    let top = [PAD, 0]
    let bottom = [PAD + MIN, 0]
    let ready = false
    let lastY = window.scrollY
    let flow = 0
    let energy = 0
    let hover = 0
    let drops = [[PAD, 0], [PAD, 0]]
    let dir = 1
    let passed = ''

    const target = () => {
      const { max, run, len } = size.current
      const at = PAD + (max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0) * run
      return [at, at + len]
    }

    const tick = (now) => {
      frame = 0
      const dt = Math.min(0.032, (now - then) / 1000 || 0.016)
      then = now
      const [t0, t1] = target()
      const y = window.scrollY
      const dy = y - lastY
      lastY = y
      thumb.current.style.transform = `translateY(${t0}px)`
      thumb.current.style.height = `${t1 - t0}px`

      if (reduced || !ready) {
        top = [t0, 0]
        bottom = [t1, 0]
        drops = drops.map(() => [(t0 + t1) / 2, 0])
        ready = true
      } else {
        // Deux demi-pas : stable même à 30 images par seconde.
        for (let i = 0; i < 2; i++) {
          const down = t0 + t1 > top[0] + bottom[0]
          top = spring(...top, t0, down ? TRAIL : LEAD, dt / 2)
          bottom = spring(...bottom, t1, down ? LEAD : TRAIL, dt / 2)
        }
        if (bottom[0] - top[0] < 28) bottom = [top[0] + 28, bottom[1]]
        const speed = Math.min(1, Math.abs(dy) / 70 + (Math.abs(top[1]) + Math.abs(bottom[1])) / 2600)
        energy += (speed - energy) * (speed > energy ? 0.3 : 0.045)
        flow += (top[1] + bottom[1]) * 0.5 * dt * 0.75
        const v = top[1] + bottom[1]
        if (Math.abs(v) > 30) dir = Math.sign(v)
        const r = 4 * Math.min(1.08, Math.max(0.72, Math.sqrt((t1 - t0) / Math.max(1, bottom[0] - top[0]))))
        // L'arrière de la colonne, un peu à l'intérieur : au repos, les gouttes s'y fondent.
        const tail = dir > 0 ? top[0] + r * 1.3 : bottom[0] - r * 1.3
        const head = dir > 0 ? bottom[0] - r : top[0] + r
        drops = drops.map((drop, i) => {
          for (let j = 0; j < 2; j++) drop = spring(...drop, tail, DROPS[i], dt / 2)
          let [y, vy] = drop
          // Jamais devant la colonne, jamais trop loin derrière.
          if (dir > 0 ? y > head : y < head) [y, vy] = [head, 0]
          if (Math.abs(y - tail) > DROP_MAX) y = tail + Math.sign(y - tail) * DROP_MAX
          return [y, vy]
        })
      }
      const want = root.matches(':hover') || grab.current !== null ? 1 : 0
      hover += (want - hover) * (reduced ? 1 : 0.2)
      const len = bottom[0] - top[0]
      const thin = Math.min(1.08, Math.max(0.72, Math.sqrt((t1 - t0) / Math.max(1, len))))
      liquid?.draw({ top: top[0], bottom: bottom[0], flow: reduced ? 0 : flow, energy: reduced ? 0 : energy, hover, thin, drops: drops.map((x) => x[0]), dropSize: DROP_SIZE })

      // Jauge : les repères de section franchis par l'eau passent en aqua.
      const level = t0 + (t1 - t0) / 2
      const els = root.querySelectorAll('.water-mark')
      const reached = points.map((m) => (m.y <= level + 1 ? 1 : 0)).join('') + els.length
      if (reached !== passed) {
        passed = reached
        els.forEach((el, i) => { el.dataset.passed = reached[i] === '1' })
      }

      if (grab.current !== null) {
        const mid = t0 + (t1 - t0) / 2
        tag.current.textContent = points.filter((m) => m.y <= mid + 1).at(-1)?.label ?? ''
        tag.current.style.transform = `translateY(${mid}px) translateY(-50%)`
      }
      const still = Math.abs(top[0] - t0) < 0.1 && Math.abs(bottom[0] - t1) < 0.1 && energy < 0.004 && Math.abs(hover - want) < 0.005 && Math.abs(top[1]) < 1 && Math.abs(bottom[1]) < 1 && drops.every(([y, vy]) => Math.abs(vy) < 1 && y >= top[0] - 0.5 && y <= bottom[0] + 0.5)
      if (!still) frame = requestAnimationFrame(tick)
    }
    wake.current = () => {
      if (frame) return
      then = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const measure = () => {
      const full = document.documentElement.scrollHeight
      const view = window.innerHeight
      const max = full - view
      const len = Math.max(MIN, (view / full) * (view - PAD * 2))
      size.current = { max, run: Math.max(1, view - PAD * 2 - len), len }
      root.dataset.idle = max < 8
      points = [...document.querySelectorAll('main h2[id]')].map((el) => {
        const at = el.getBoundingClientRect().top + window.scrollY - 110
        return { id: el.id, label: el.textContent, y: PAD + len / 2 + Math.min(1, Math.max(0, at / Math.max(1, max))) * size.current.run }
      })
      setMarks(points)
      passed = ''
      wake.current()
    }
    const onScroll = () => {
      wake.current()
      root.dataset.moving = 'true'
      clearTimeout(idle)
      idle = setTimeout(() => { root.dataset.moving = 'false' }, 1200)
    }

    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(frame)
      clearTimeout(idle)
    }
  }, [pathname])

  const moveTo = (y) => {
    const { max, run } = size.current
    window.scrollTo({ top: (Math.min(run, Math.max(0, y - PAD)) / run) * max, behavior: 'instant' })
  }
  const onPointerDown = (e) => {
    if (e.button !== 0) return
    e.preventDefault()
    const r = thumb.current.getBoundingClientRect()
    const on = e.clientY >= r.top && e.clientY <= r.bottom
    grab.current = on ? e.clientY - r.top : r.height / 2
    bar.current.setPointerCapture(e.pointerId)
    bar.current.dataset.drag = 'true'
    if (!on) moveTo(e.clientY - grab.current)
    wake.current()
  }
  const onPointerMove = (e) => { if (grab.current !== null) moveTo(e.clientY - grab.current) }
  const onPointerEnd = () => {
    grab.current = null
    bar.current.dataset.drag = 'false'
    wake.current()
  }
  const goTo = (id) => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110 })
  }

  return (
    <div ref={bar} aria-hidden="true" data-idle="true" className="water-bar" onPointerEnter={() => wake.current()} onPointerLeave={() => wake.current()}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd}>
      <canvas ref={canvas} className="water-canvas" />
      <div ref={thumb} className="water-thumb" />
      {marks.map((m) => (
        <div key={m.id} className="water-mark" style={{ top: m.y }} onPointerDown={(e) => e.stopPropagation()} onClick={() => goTo(m.id)}><span className="water-label">{m.label}</span></div>
      ))}
      <span ref={tag} className="water-label water-tag" />
    </div>
  )
}
