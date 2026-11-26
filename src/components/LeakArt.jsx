// Illustration de la page 404 : une conduite déboîtée qui goutte. Animation en CSS, figée si
// l'utilisateur réduit les animations.
const DROPS = [0, 1, 2]

export default function LeakArt({ className = '' }) {
  return (
    <svg viewBox="0 0 480 280" className={`leak ${className}`} fill="none" aria-hidden="true">
      {/* Flaque et ondes */}
      <ellipse cx="236" cy="252" rx="74" ry="7" fill="#0e7cc2" opacity="0.35" className="leak-puddle" />
      {DROPS.map((i) => (
        <ellipse key={i} cx="236" cy="252" rx="46" ry="5" stroke="#2ec4b6" strokeWidth="1.5" className="leak-ripple" style={{ '--i': i }} />
      ))}
      {/* Tronçon gauche */}
      <rect x="-10" y="70" width="214" height="36" fill="#24486f" />
      <path d="M-10 70h214M-10 106h214" stroke="#b9cde0" strokeWidth="2" />
      <rect x="196" y="58" width="18" height="60" rx="2" fill="#24486f" stroke="#b9cde0" strokeWidth="2" />
      <path d="M40 70v36M120 70v36" stroke="#b9cde0" strokeOpacity="0.35" strokeWidth="2" />
      {/* Tronçon droit, déboîté */}
      <g transform="rotate(7 262 88)">
        <rect x="262" y="70" width="240" height="36" fill="#24486f" />
        <path d="M262 70h240M262 106h240" stroke="#b9cde0" strokeWidth="2" />
        <rect x="254" y="58" width="18" height="60" rx="2" fill="#24486f" stroke="#b9cde0" strokeWidth="2" />
        <path d="M360 70v36M440 70v36" stroke="#b9cde0" strokeOpacity="0.35" strokeWidth="2" />
      </g>
      {/* Boulons */}
      {[66, 88, 110].map((y) => <circle key={y} cx="205" cy={y - 2} r="2.2" fill="#b9cde0" />)}
      {/* Filet d'eau qui perle sous le joint */}
      <path d="M226 106c0 6 4 9 10 9s10-3 10-9" fill="#0e7cc2" className="leak-bead" />
      {DROPS.map((i) => (
        <path key={i} d="M236 112c-5 7-7 10.5-7 13.5a7 7 0 0 0 14 0c0-3-2-6.5-7-13.5Z" fill="#2ec4b6" className="leak-drop" style={{ '--i': i }} />
      ))}
      {/* Projection sur la paroi */}
      <path d="M214 92c6 2 10 6 12 12" stroke="#2ec4b6" strokeWidth="2" strokeLinecap="round" className="leak-spray" />
    </svg>
  )
}
