'use client'
import { useEffect } from 'react'

const MIN = 900 // ms depuis le début du chargement : le temps de voir la goutte se remplir
const MAX = 2600

// Ouvre l'intro dès que la page est interactive et les polices prêtes. Les animations du hero,
// en pause dessous, démarrent pendant que le rideau remonte.
export default function IntroGate() {
  useEffect(() => {
    const html = document.documentElement
    if (!html.classList.contains('intro')) return
    let done = false
    const open = () => {
      if (done) return
      done = true
      try { sessionStorage.setItem('amepa-intro', '1') } catch {}
      html.classList.add('intro-leave')
      setTimeout(() => html.classList.remove('intro', 'intro-leave'), 800)
    }
    const wait = new Promise((r) => setTimeout(r, Math.max(0, MIN - performance.now())))
    Promise.all([document.fonts?.ready, wait]).then(open)
    const cap = setTimeout(open, Math.max(0, MAX - performance.now()))
    return () => clearTimeout(cap)
  }, [])
  return null
}
