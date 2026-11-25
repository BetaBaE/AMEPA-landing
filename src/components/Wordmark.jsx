// Nom composé en attendant le fichier du logo officiel.
// Pour l'installer : déposer le SVG dans public/logo.svg et remplacer ce contenu par une <Image>.
export default function Wordmark({ light = false }) {
  return (
    <span dir="ltr" style={{ fontFamily: 'var(--font-heading)' }} className={`block font-display text-[1.6rem] font-bold leading-none tracking-[-0.03em] ${light ? 'text-white' : 'text-ocean'}`}>
      AMEPA
      <svg viewBox="0 0 96 8" className="mt-1 block h-2 w-full text-aqua" fill="none" aria-hidden="true">
        <path d="M1 4c8-5 15-5 23 0s16 5 24 0 16-5 24 0 15 5 23 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </span>
  )
}
