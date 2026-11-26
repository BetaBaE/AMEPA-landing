import { useId } from 'react'

const DROP = 'M32 3C32 3 7 33 7 51.5a25 25 0 0 0 50 0C57 33 32 3 32 3Z'
// Deux périodes de vague : la translation d'une période boucle sans à-coup.
const WAVE = 'M-64 0q16-5 32 0t32 0 32 0 32 0 32 0 32 0 32 0 32 0V90H-64Z'

// Goutte qui se remplit, en SVG et CSS : visible avant le JavaScript.
// `loop` : remplit puis se vide en boucle (chargement d'une page) ; sinon se remplit une fois.
export default function WaterDrop({ loop = false, className = '' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 64 80" className={`drop ${loop ? 'drop-loop' : ''} ${className}`} aria-hidden="true">
      <defs><clipPath id={`d${id}`}><path d={DROP} /></clipPath></defs>
      <g clipPath={`url(#d${id})`}>
        <rect width="64" height="80" fill="currentColor" opacity="0.08" />
        <g className="drop-level">
          <path className="drop-wave drop-wave-back" d={WAVE} fill="#2ec4b6" opacity="0.55" />
          <path className="drop-wave" d={WAVE} fill="#0e7cc2" />
        </g>
        <ellipse cx="21" cy="47" rx="3.5" ry="8" fill="#fff" opacity="0.3" transform="rotate(18 21 47)" />
      </g>
      <path d={DROP} fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.85" />
    </svg>
  )
}
