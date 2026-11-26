import Wordmark from '../Wordmark'
import IntroGate from './IntroGate'
import WaterDrop from './WaterDrop'

// Exécuté avant le premier affichage. L'intro ne s'affiche qu'à la première page de la session,
// jamais sans JavaScript ni avec « réduire les animations », et se retire seule au bout de 4 s quoi qu'il arrive.
const SCRIPT = `try{if(!sessionStorage.getItem('amepa-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){var h=document.documentElement;h.classList.add('intro');setTimeout(function(){h.classList.remove('intro','intro-leave')},4000)}}catch(e){}`

// Écran d'accueil : une goutte se remplit pendant que la page, les polices et les animations se chargent.
export default function Intro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
      <div className="intro-screen" aria-hidden="true">
        <div className="intro-mark">
          <WaterDrop className="intro-drop" />
          <Wordmark light />
        </div>
        <svg className="intro-edge" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path fill="var(--color-ocean-deep)" d="M0 0h1440v14c-60 0-60 14-120 14S1260 6 1200 6s-60 22-120 22-60-22-120-22-60 22-120 22-60-22-120-22-60 22-120 22-60-22-120-22-60 22-120 22S540 6 480 6s-60 22-120 22S300 6 240 6s-60 22-120 22S60 14 0 14Z" />
        </svg>
      </div>
      <IntroGate />
    </>
  )
}
