import { useTranslations } from 'next-intl'

// Position de chaque station sur la ligne d'eau : [x, niveau d'eau, terrain].
const STATIONS = [
  ['source', 120, 82, 129],
  ['treatment', 360, 156, 168],
  ['storage', 600, 54, 112],
  ['network', 840, 202, 190],
  ['wastewater', 1080, 196, 204],
  ['reuse', 1320, 226, 214],
]

const GROUND = 'M0 60 40 44 84 70 104 128 196 132 270 168H484L520 126 548 112H654L716 150 762 190H920L990 204H1190L1246 214H1440'
const WATER = 'M0 46C30 40 62 60 92 82c8-5 14-5 22 0s14 5 22 0 14-5 24 0C196 92 206 156 262 156H300c10-4 20-4 30 0s20 4 30 0 20-4 30 0 20 4 30 0C486 156 500 54 572 54c9-3 18-3 28 0s19 3 28 0C704 54 700 202 772 202H920C966 202 976 196 1010 196c9-4 18-4 27 0s18 4 27 0 18-4 28 0C1150 196 1200 226 1264 226H1440'

// Signature du site : le cycle de l'eau dessiné comme un profil en long d'ingénieur,
// du barrage à la réutilisation. Schématique, sans cote ni échelle.
export default function WaterProfile() {
  const t = useTranslations('home')
  return (
    <div className="relative">
      <div className="overflow-hidden">
        <svg role="img" aria-label={t('profileLabel')} viewBox="0 14 1440 246" className="relative start-1/2 block h-auto w-[max(100%,56rem)] max-w-none -translate-x-1/2 rtl:translate-x-1/2 rtl:-scale-x-100"
          fill="none" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#24486f" stopOpacity=".75" /><stop offset="1" stopColor="#24486f" stopOpacity=".1" />
            </linearGradient>
          </defs>
          <path fill="url(#ground)" d={`${GROUND}V260H0z`} />
          <path stroke="#5b82a8" strokeWidth="1.5" d={GROUND} />
          {/* Retenue du barrage */}
          <path fill="#2ec4b6" fillOpacity=".18" d="M88 82h72v48l-56-2z" />
          {STATIONS.map(([s, x, water, ground], i) => <path key={s} className="profile-station" style={{ '--i': i }} stroke="#5b82a8" strokeDasharray="2 6" d={`M${x} 260V${Math.max(water, ground) + 10}`} />)}
          <g stroke="#c9d9e8" strokeWidth="1.8">
            <path className="profile-station" style={{ '--i': 0 }} d="M160 131V72h12l24 60" fill="#0b2a4a" />
            <path className="profile-station" style={{ '--i': 1 }} d="M300 168v-22M340 168v-22M380 168v-22M420 168v-22M434 168v-30l18-11 18 11v30M447 150h10" />
            <path className="profile-station" style={{ '--i': 2 }} d="M582 112V72M618 112V72M582 92h36M570 72h60l7-38h-74zM600 34V20" />
            <path className="profile-station" style={{ '--i': 3 }} d="M768 190v-38h26v38M794 190v-58h30v58M824 190v-44h26v44M850 190v-66h32v66M882 190v-36h26v36M803 146h12M803 158h12M803 170h12M860 138h12M860 150h12M860 162h12M860 174h12" />
            <path className="profile-station" style={{ '--i': 4 }} d="M1010 204v-18M1092 204v-18M1051 186v18M1106 204c0-18 11-28 30-28s30 10 30 28zM1136 176v-10M1126 166h20" />
            <path className="profile-station" style={{ '--i': 5 }} d="M1268 213c0-14 3-24 9-32M1268 199c-6-3-9-8-9-13 6 1 9 5 9 13M1302 213c0-14 3-24 9-32M1302 199c-6-3-9-8-9-13 6 1 9 5 9 13M1336 213c0-14 3-24 9-32M1336 199c-6-3-9-8-9-13 6 1 9 5 9 13M1370 213c0-14 3-24 9-32M1370 199c-6-3-9-8-9-13 6 1 9 5 9 13" />
          </g>
          <path pathLength="1" className="profile-line" stroke="#2ec4b6" strokeWidth="3.5" d={WATER} />
          <path className="profile-flow" stroke="#fff" strokeOpacity=".85" strokeWidth="3" d={WATER} />
          {STATIONS.map(([s, x, water], i) => <circle key={s} className="profile-station" style={{ '--i': i }} cx={x} cy={water} r="6" fill="#0b2a4a" stroke="#2ec4b6" strokeWidth="3" />)}
        </svg>
      </div>
      <ol className="hidden grid-cols-6 border-t border-ocean-line bg-ocean md:grid" aria-hidden="true">
        {STATIONS.map(([s], i) => (
          <li key={s} className="profile-station px-2 py-3.5 text-center text-[0.9375rem] font-medium text-mist" style={{ '--i': i }}>{t(`stations.${s}`)}</li>
        ))}
      </ol>
    </div>
  )
}
