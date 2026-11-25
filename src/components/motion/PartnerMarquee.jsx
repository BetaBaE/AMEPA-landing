'use client'
import { Pause, Play } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'
import { plain } from '@/lib/format'
import { hasImage, imageUrl } from '@/sanity/lib/image'

const MIN = 6

function Items({ partners, label, duplicate = false }) {
  return (
    <ul aria-hidden={duplicate || undefined} className={`marquee-set ${duplicate ? 'marquee-copy' : ''}`}>
      {partners.map((m) => (
        <li key={m._id} className="shrink-0">
          {hasImage(m.logo)
            ? <Image src={imageUrl(m.logo, { width: 360, fit: 'max' })} alt={duplicate ? '' : m.name} width={180} height={72} className="marquee-logo max-h-18 w-auto object-contain" />
            : <span className="font-display text-2xl font-semibold text-muted">{plain(m.name, label)}</span>}
        </li>
      ))}
    </ul>
  )
}

// Défilement en CSS, inversé en arabe. Sous six partenaires, une simple liste : rien à faire défiler.
export default function PartnerMarquee({ partners }) {
  const t = useTranslations()
  const [paused, setPaused] = useState(false)
  if (partners.length < MIN) return <div className="marquee-static"><Items partners={partners} label={t('meta.tbc')} /></div>
  return (
    <div>
      <div className="marquee" tabIndex={0} role="group" aria-label={t('home.partners')} data-paused={paused} style={{ '--count': partners.length }}>
        <div className="marquee-track"><Items partners={partners} label={t('meta.tbc')} /><Items partners={partners} label={t('meta.tbc')} duplicate /></div>
      </div>
      <button type="button" onClick={() => setPaused(!paused)} className="marquee-toggle mt-5 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-muted hover:text-ocean">
        {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}{t(paused ? 'home.marqueePlay' : 'home.marqueePause')}
      </button>
    </div>
  )
}
