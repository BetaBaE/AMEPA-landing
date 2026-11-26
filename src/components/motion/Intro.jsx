import Wordmark from '../Wordmark'
import IntroGate from './IntroGate'
import WaterDrop from './WaterDrop'

// 1) Avant le premier affichage : l'intro ne s'affiche qu'à la première page de la session,
// jamais sans JavaScript ni avec « réduire les animations », et se retire seule au bout de 6 s quoi qu'il arrive.
const START = `try{if(!sessionStorage.getItem('amepa-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){var h=document.documentElement;h.classList.add('intro');setTimeout(function(){h.classList.remove('intro','intro-leave')},6000)}}catch(e){}`

// 2) Compteur 0 → 100 % qui suit le vrai chargement : HTML lu, page interactive (IntroGate),
// polices et ressources chargées. Il avance en douceur entre ces étapes et n'atteint 100 qu'une fois tout prêt.
const COUNT = `(function(){var h=document.documentElement;if(!h.classList.contains('intro'))return;
var s=document.querySelector('.intro-screen'),n=s&&s.querySelector('.intro-count'),p=0,end=0;if(!n)return;
function goal(t){var g=.55*(1-Math.exp(-t/600));if(document.readyState!=='loading')g+=.2;if(window.__amepaReady)g+=.15;
if(window.__amepaReady&&document.readyState==='complete'&&t>1100||t>3600)return 1;return Math.min(g,.97)}
function step(){var t=performance.now(),g=goal(t);p+=(g-p)*(g===1?.16:.07);if(g===1&&p>.995)p=1;
s.style.setProperty('--p',p.toFixed(4));n.textContent=Math.floor(p*100);
if(p<1)return requestAnimationFrame(step);if(!end){end=1;try{sessionStorage.setItem('amepa-intro','1')}catch(e){}
setTimeout(function(){h.classList.add('intro-leave');setTimeout(function(){h.classList.remove('intro','intro-leave')},800)},220)}}
requestAnimationFrame(step)})()`

// Écran de chargement : une goutte se remplit au rythme du compteur pendant que la page,
// les polices et les animations se chargent. Les animations du hero attendent l'ouverture.
export default function Intro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: START }} />
      <div className="intro-screen" aria-hidden="true" suppressHydrationWarning>
        <div className="intro-mark">
          <WaterDrop className="intro-drop" />
          <p className="intro-percent" dir="ltr"><span className="intro-count" suppressHydrationWarning>0</span><span className="intro-sign">%</span></p>
          <span className="intro-pipe"><span className="intro-pipe-fill" /></span>
        </div>
        <div className="intro-brand"><Wordmark light /></div>
        <svg className="intro-edge" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path fill="var(--color-ocean-deep)" d="M0 0h1440v14c-60 0-60 14-120 14S1260 6 1200 6s-60 22-120 22-60-22-120-22-60 22-120 22-60-22-120-22-60 22-120 22-60-22-120-22-60 22-120 22S540 6 480 6s-60 22-120 22S300 6 240 6s-60 22-120 22S60 14 0 14Z" />
        </svg>
      </div>
      <script dangerouslySetInnerHTML={{ __html: COUNT }} />
      <IntroGate />
    </>
  )
}
