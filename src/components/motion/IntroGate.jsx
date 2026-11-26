'use client'
import { useEffect } from 'react'

// Signale au compteur de l'intro (script en ligne dans Intro.jsx) que la page est interactive
// et ses polices prêtes. C'est le compteur qui ouvre le rideau en atteignant 100 %.
export default function IntroGate() {
  useEffect(() => {
    if (!document.documentElement.classList.contains('intro')) return
    const fonts = document.fonts?.ready ?? Promise.resolve()
    fonts.then(() => { window.__amepaReady = true })
  }, [])
  return null
}
